"""
URL configuration for CarFusion project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from api.views import  *
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('cars/', CarRegisterView.as_view(), name='car-register'),
    path('cars/<int:pk>/', CarView.as_view(), name='car-detail'),
    path('carsSuggestion/<int:pk>/', CarSuggestion.as_view(), name='car-suggestion'),
    path('cars/<int:car_id>/images/', CarImageListView.as_view(), name='car-images'),
    path('cars/<int:car_id>/reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('liked-cars/', LikedCarListCreateView.as_view(), name='liked-cars'),
    path('liked-cars/<int:car_id>/', LikedCarListCreateView.as_view(), name='liked-car-remove'),
    path('create-order/', CreateOrderAPIView.as_view(), name='create-order'),
    path('verify-payment/', VerifyPaymentAPIView.as_view(), name='verify-payment'),
    path('queries/<int:id>/', QueryCreateView.as_view(), name='query-create'),
    path('queries/response/<int:id>/', QueryResponseView.as_view(), name='query-create'),
    path('queries/', QueryListView.as_view(), name='query-list'),
    path('transactions/', TransactionView.as_view(), name='transaction-list'),



]

if settings.DEBUG:  
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)











    