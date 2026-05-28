from rest_framework import serializers
from .models import Memory, Commit, Message, Wish, MapPin, JournalEntry, ScrapbookItem, RoadmapItem


class MemorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Memory
        fields = "__all__"


class CommitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Commit
        fields = "__all__"


class MessageReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "name", "message", "type", "location", "created_at"]


class MessageWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["name", "message", "type", "location"]

    def validate_message(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Message is too short.")
        return value.strip()

    def validate_name(self, value):
        return value.strip() if value else "Anonymous"


class WishReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wish
        fields = ["id", "name", "wish_text", "prophecy", "created_at"]


class WishWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wish
        fields = ["name", "wish_text"]

    def validate_wish_text(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Wish is too short.")
        return value.strip()

    def validate_name(self, value):
        return value.strip() if value else "Anonymous"


class MapPinSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapPin
        fields = ["id", "name", "location", "latitude", "longitude", "created_at"]


class MapPinWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapPin
        fields = ["name", "location", "latitude", "longitude"]

    def validate(self, data):
        lat = data.get("latitude")
        lon = data.get("longitude")
        if not (-90 <= lat <= 90):
            raise serializers.ValidationError({"latitude": "Invalid latitude."})
        if not (-180 <= lon <= 180):
            raise serializers.ValidationError({"longitude": "Invalid longitude."})
        return data


class JournalEntryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ["id", "title", "excerpt", "created_at"]


class JournalEntryDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = JournalEntry
        fields = ["id", "title", "content", "excerpt", "created_at"]


class ScrapbookItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScrapbookItem
        fields = "__all__"


class RoadmapItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoadmapItem
        fields = "__all__"
