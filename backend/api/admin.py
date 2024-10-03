from django.contrib import admin
from .models import *

# admin.site.site_header("Website")
admin.site.register(UserProfile)
admin.site.register(Make)
admin.site.register(Model)
admin.site.register(Car)
admin.site.register(Review)
admin.site.register(CarImage)
admin.site.register(LikedCar)
admin.site.register(Transaction)
admin.site.register(Query)
