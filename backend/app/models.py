from django.db import models


class Memory(models.Model):
    CATEGORY_CHOICES = [
        ("growth", "Growth / Achievement"),
        ("productive", "Productive / Consistent"),
        ("emotional", "Emotional / Relational"),
        ("experiment", "Experimentation / Ideation"),
        ("difficult", "Difficult / Failure"),
        ("faith", "Faith"),
        ("basketball", "Basketball / Physical"),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    color = models.CharField(max_length=20, blank=True)
    image = models.URLField(blank=True)
    quote = models.TextField(blank=True)
    song = models.CharField(max_length=200, blank=True)
    code_snippet = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["date"]

    def __str__(self):
        return f"{self.date} — {self.title}"


class Commit(models.Model):
    TYPE_CHOICES = [
        ("feat", "feat"),
        ("fix", "fix"),
        ("refactor", "refactor"),
        ("perf", "perf"),
        ("chore", "chore"),
        ("hotfix", "hotfix"),
        ("revert", "revert"),
        ("merge", "merge"),
    ]

    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    scope = models.CharField(max_length=100)
    message = models.CharField(max_length=500)
    reflection = models.TextField(blank=True)
    timestamp = models.DateTimeField()
    branch = models.CharField(max_length=100, default="life/main")
    tag = models.CharField(max_length=50, blank=True)

    class Meta:
        ordering = ["-timestamp"]

    def __str__(self):
        return f"{self.type}({self.scope}): {self.message}"


class Message(models.Model):
    TYPE_CHOICES = [
        ("commit", "commit"),
        ("pr", "pull request"),
        ("issue", "issue"),
        ("log", "log"),
    ]

    name = models.CharField(max_length=100, blank=True, default="Anonymous")
    message = models.TextField(max_length=280)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="commit")
    location = models.CharField(max_length=200, blank=True)
    ip_hash = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_visible = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.type} by {self.name or 'Anonymous'}: {self.message[:60]}"


class Wish(models.Model):
    name = models.CharField(max_length=100, blank=True, default="Anonymous")
    wish_text = models.TextField(max_length=500)
    prophecy = models.TextField()
    ip_hash = models.CharField(max_length=64, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Wish from {self.name or 'Anonymous'}: {self.wish_text[:60]}"


class MapPin(models.Model):
    name = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=200)
    latitude = models.FloatField()
    longitude = models.FloatField()
    message_ref = models.ForeignKey(
        Message, null=True, blank=True, on_delete=models.SET_NULL, related_name="pins"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name or 'Pin'} @ {self.location}"


class JournalEntry(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    excerpt = models.TextField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class ScrapbookItem(models.Model):
    CATEGORY_CHOICES = [
        ("hackathon", "Hackathon"),
        ("code", "Code"),
        ("people", "People"),
        ("basketball", "Basketball"),
        ("random", "Random"),
    ]

    image_url = models.URLField()
    caption = models.CharField(max_length=200, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    date_taken = models.DateField(blank=True, null=True)

    class Meta:
        ordering = ["-date_taken"]

    def __str__(self):
        return f"{self.category} — {self.caption or self.image_url[:40]}"


class RoadmapItem(models.Model):
    VERSION_CHOICES = [
        ("v18", "v18.0.0"),
        ("v19", "v19.0.0"),
        ("v20", "v20.0.0"),
    ]

    version = models.CharField(max_length=10, choices=VERSION_CHOICES)
    text = models.CharField(max_length=300)
    is_done = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["version", "order"]

    def __str__(self):
        return f"[{self.version}] {self.text}"
