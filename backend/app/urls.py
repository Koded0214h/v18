from django.urls import path
from . import views

urlpatterns = [
    path("health/", views.HealthView.as_view()),
    path("memories/", views.MemoryListView.as_view()),
    path("memories/<int:pk>/", views.MemoryDetailView.as_view()),
    path("commits/", views.CommitListView.as_view()),
    path("messages/", views.MessageListCreateView.as_view()),
    path("wishes/", views.WishListCreateView.as_view()),
    path("pins/", views.MapPinListCreateView.as_view()),
    path("journal/", views.JournalEntryListView.as_view()),
    path("journal/<int:pk>/", views.JournalEntryDetailView.as_view()),
    path("scrapbook/", views.ScrapbookListView.as_view()),
    path("roadmap/", views.RoadmapListView.as_view()),
    path("stats/", views.StatsView.as_view()),
]
