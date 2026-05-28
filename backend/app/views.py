from google import genai
from django.conf import settings
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Memory, Commit, Message, Wish, MapPin, JournalEntry, ScrapbookItem, RoadmapItem
from .serializers import (
    MemorySerializer,
    CommitSerializer,
    MessageReadSerializer,
    MessageWriteSerializer,
    WishReadSerializer,
    WishWriteSerializer,
    MapPinSerializer,
    MapPinWriteSerializer,
    JournalEntryListSerializer,
    JournalEntryDetailSerializer,
    ScrapbookItemSerializer,
    RoadmapItemSerializer,
)
from .utils import get_client_ip, hash_ip, is_rate_limited


# ── Memories ──────────────────────────────────────────────────────────────────

class MemoryListView(generics.ListAPIView):
    queryset = Memory.objects.all()
    serializer_class = MemorySerializer
    pagination_class = None  # return full grid


class MemoryDetailView(generics.RetrieveAPIView):
    queryset = Memory.objects.all()
    serializer_class = MemorySerializer


# ── Commits ───────────────────────────────────────────────────────────────────

class CommitListView(generics.ListAPIView):
    serializer_class = CommitSerializer

    def get_queryset(self):
        qs = Commit.objects.all()
        commit_type = self.request.query_params.get("type")
        if commit_type:
            qs = qs.filter(type=commit_type)
        return qs


# ── Messages ──────────────────────────────────────────────────────────────────

class MessageListCreateView(APIView):
    def get(self, request):
        messages = Message.objects.filter(is_visible=True)
        serializer = MessageReadSerializer(messages, many=True)
        return Response(serializer.data)

    def post(self, request):
        ip = get_client_ip(request)
        ip_hash = hash_ip(ip)

        # 5 messages per hour per IP
        if is_rate_limited(ip_hash, "msg", limit=5, window=3600):
            return Response(
                {"error": "Rate limit reached. You can send 5 messages per hour."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        serializer = MessageWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        msg = serializer.save(ip_hash=ip_hash)

        # If location provided, spin up a map pin (lat/lon must be sent by frontend)
        lat = request.data.get("latitude")
        lon = request.data.get("longitude")
        if lat is not None and lon is not None:
            try:
                MapPin.objects.create(
                    name=msg.name,
                    location=msg.location or "",
                    latitude=float(lat),
                    longitude=float(lon),
                    message_ref=msg,
                )
            except (ValueError, TypeError):
                pass

        return Response(MessageReadSerializer(msg).data, status=status.HTTP_201_CREATED)


# ── Wishes / Oracle ───────────────────────────────────────────────────────────

ORACLE_SYSTEM_PROMPT = (
    "You are a mystical oracle who responds to birthday wishes for a young software engineer "
    "named Abdulrahman (Koded) who is turning 18. You speak in short, cinematic, slightly "
    "cryptic prophecies — 2-4 sentences max. You reference themes of engineering, growth, "
    "faith, hustle, and the future. Never be generic. Always feel intentional."
)


def generate_prophecy(wish_text: str) -> str:
    if not settings.GEMINI_API_KEY:
        return "The Oracle is silent in this environment. Configure GEMINI_API_KEY to hear its voice."

    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=f'The wish is: "{wish_text}"',
        config=genai.types.GenerateContentConfig(
            system_instruction=ORACLE_SYSTEM_PROMPT,
        ),
    )
    return response.text.strip()


class WishListCreateView(APIView):
    def get(self, request):
        wishes = Wish.objects.all()
        serializer = WishReadSerializer(wishes, many=True)
        return Response(serializer.data)

    def post(self, request):
        ip = get_client_ip(request)
        ip_hash = hash_ip(ip)

        # 3 wishes per day per IP
        if is_rate_limited(ip_hash, "wish", limit=3, window=86400):
            return Response(
                {"error": "Rate limit reached. You can submit 3 wishes per day."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        serializer = WishWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            prophecy = generate_prophecy(serializer.validated_data["wish_text"])
        except Exception:
            return Response(
                {"error": "The Oracle is silent. Try again."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )


        wish = serializer.save(ip_hash=ip_hash, prophecy=prophecy)
        return Response(WishReadSerializer(wish).data, status=status.HTTP_201_CREATED)


# ── Map Pins ──────────────────────────────────────────────────────────────────

class MapPinListCreateView(APIView):
    def get(self, request):
        pins = MapPin.objects.all()
        serializer = MapPinSerializer(pins, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MapPinWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        pin = serializer.save()
        return Response(MapPinSerializer(pin).data, status=status.HTTP_201_CREATED)


# ── Journal ───────────────────────────────────────────────────────────────────

class JournalEntryListView(generics.ListAPIView):
    queryset = JournalEntry.objects.filter(is_public=True)
    serializer_class = JournalEntryListSerializer


class JournalEntryDetailView(generics.RetrieveAPIView):
    queryset = JournalEntry.objects.filter(is_public=True)
    serializer_class = JournalEntryDetailSerializer


# ── Scrapbook ─────────────────────────────────────────────────────────────────

class ScrapbookListView(generics.ListAPIView):
    serializer_class = ScrapbookItemSerializer

    def get_queryset(self):
        qs = ScrapbookItem.objects.all()
        category = self.request.query_params.get("category")
        if category:
            qs = qs.filter(category=category)
        return qs


# ── Roadmap ───────────────────────────────────────────────────────────────────

class RoadmapListView(APIView):
    def get(self, request):
        items = RoadmapItem.objects.all()
        grouped = {}
        for item in items:
            grouped.setdefault(item.version, []).append(RoadmapItemSerializer(item).data)
        return Response(grouped)


# ── System Stats ──────────────────────────────────────────────────────────────

class StatsView(APIView):
    def get(self, request):
        return Response({
            "name": "Abdulrahman Raufu",
            "handle": "Koded",
            "version": "18.0.0",
            "build_date": "May 31, 2026",
            "current_mission": "Becoming undeniable",
            "status": "IN PROGRESS",
            "uptime": "18 years, 0 days",
            "location": "Lagos, Nigeria",
            "faith": "Muslim",
            "cgpa": 4.59,
            "all_nighters_survived": 14,
            "hackathons_entered": 6,
            "hackathons_won": 2,
            "bugs_created": "∞",
            "ideas_started": 31,
            "ideas_shipped": 7,
            "songs_on_repeat": 4,
            "prayers_said": "countless",
        })
