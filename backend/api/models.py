from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):

    USER_TYPE_CHOICES = [
        ('buyer', 'Buyer'),
        ('seller', 'Seller'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    gender = models.CharField(max_length = 10, choices = [('male','Male'),('female',"Female")])
    address = models.TextField()
    email = models.EmailField()
    city = models.CharField(max_length=100)
    phone_num = models.CharField(max_length=15  )
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True) 
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES, default='buyer')


    def __str__(self):
        return f"{self.user.username} ({self.user_type})"



class Make(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Model(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Car(models.Model):
    TRANSMISSION_CHOICES = (
        ('Automatic', 'Automatic'),
        ('Manual', 'Manual'),
        ('CVT', 'CVT'),
        ('Semi-Automatic', 'Semi-Automatic'),
    )

    CONDITION_CHOICES = (
        ('New', 'New'),
        ('Used', 'Used'),
        ('Certified Pre-Owned', 'Certified Pre-Owned'),
    )

    details = models.CharField(max_length=100, blank=True, null=True)
    make = models.ForeignKey(Make, on_delete=models.CASCADE)
    model = models.ForeignKey(Model, on_delete=models.CASCADE)
    year = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()
    seller = models.ForeignKey(UserProfile, on_delete=models.CASCADE, limit_choices_to={'user_type': 'seller'})
    color = models.CharField(max_length=30)
    transmission = models.CharField(max_length=20, choices=TRANSMISSION_CHOICES)
    mileage = models.PositiveIntegerField(help_text="Mileage in kilometers")
    condition = models.CharField(max_length=30, choices=CONDITION_CHOICES)
    number_of_doors = models.PositiveIntegerField(default=4, help_text="Number of doors")
    location = models.CharField(max_length=100, blank=True, null=True)
    fuel_type = models.CharField(max_length=20, choices=[
        ('Petrol', 'Petrol'),
        ('Diesel', 'Diesel'),
        ('Electric', 'Electric'),
        ('Hybrid', 'Hybrid'),
    ])
    image = models.ImageField(upload_to='car_images/', blank=True, null=True)
    is_sold = models.BooleanField(default=False)
    def __str__(self):
        return f"{self.year} {self.make.name} {self.model.name}"

class CarImage(models.Model):
    car = models.ForeignKey(Car, related_name='images', on_delete=models.CASCADE)
    image_data = models.ImageField(upload_to='car_images/')  # Specify the upload directory

    def __str__(self):
        return f"{self.car.make} {self.car.model} Image"



class Review(models.Model):
    car = models.ForeignKey(Car, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    rating = models.PositiveIntegerField(choices=[(i, str(i)) for i in range(1, 6)])  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} review for {self.car.make} {self.car.model}'


class LikedCar(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'car')  

    def __str__(self):
        return f"{self.user.user.username} liked {self.car.make.name} {self.car.model.name}"



class Transaction(models.Model):
    buyer = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_id = models.CharField(max_length=255, blank=True, null=True)
    payment_status = models.CharField(max_length=50, blank=True, null=True)
    transaction_reference = models.CharField(max_length=255, blank=True, null=True)


class Query(models.Model):
    buyer = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='queries')
    seller = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name='responses')
    car = models.ForeignKey(Car, on_delete=models.CASCADE, null=True, blank=True)  
    content = models.TextField()
    response_content = models.TextField(null=True, blank=True)  
    is_answered = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Query from {self.buyer.user.username} to {self.seller.user.username} about {self.car.make.name if self.car else 'a car'}"
