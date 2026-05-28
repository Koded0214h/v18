from django.contrib import admin
from .models import Memory, Commit, Message, Wish, MapPin, JournalEntry, ScrapbookItem, RoadmapItem


@admin.register(Memory)
class MemoryAdmin(admin.ModelAdmin):
    list_display = ["date", "title", "category"]
    list_filter = ["category"]
    search_fields = ["title", "description"]
    date_hierarchy = "date"


@admin.register(Commit)
class CommitAdmin(admin.ModelAdmin):
    list_display = ["timestamp", "type", "scope", "message"]
    list_filter = ["type"]
    search_fields = ["message", "scope"]
    date_hierarchy = "timestamp"


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ["created_at", "name", "type", "message", "is_visible"]
    list_filter = ["type", "is_visible"]
    search_fields = ["name", "message"]
    list_editable = ["is_visible"]
    date_hierarchy = "created_at"


@admin.register(Wish)
class WishAdmin(admin.ModelAdmin):
    list_display = ["created_at", "name", "wish_text"]
    search_fields = ["name", "wish_text"]
    date_hierarchy = "created_at"
    readonly_fields = ["prophecy", "ip_hash"]


@admin.register(MapPin)
class MapPinAdmin(admin.ModelAdmin):
    list_display = ["name", "location", "latitude", "longitude", "created_at"]
    search_fields = ["name", "location"]


@admin.register(JournalEntry)
class JournalEntryAdmin(admin.ModelAdmin):
    list_display = ["title", "created_at", "is_public"]
    list_editable = ["is_public"]
    search_fields = ["title", "content"]


@admin.register(ScrapbookItem)
class ScrapbookItemAdmin(admin.ModelAdmin):
    list_display = ["category", "caption", "date_taken"]
    list_filter = ["category"]


@admin.register(RoadmapItem)
class RoadmapItemAdmin(admin.ModelAdmin):
    list_display = ["version", "order", "text", "is_done"]
    list_filter = ["version", "is_done"]
    list_editable = ["is_done", "order"]
