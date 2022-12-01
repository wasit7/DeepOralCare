from django.urls import path, include
from .api.routers import router as api_router

urlpatterns = [
    path('api/', include(api_router.urls))
]
