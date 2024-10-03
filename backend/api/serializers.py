from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *

class SignUpSerializer(serializers.ModelSerializer):
    password = serializers.CharField(max_length=20, write_only=True)
    email = serializers.EmailField(write_only=True)
    username = serializers.CharField(max_length=100, required=True)
    user_type = serializers.ChoiceField(choices=UserProfile.USER_TYPE_CHOICES)  

    class Meta:
        model = UserProfile
        fields = ['username', 'password', 'gender', 'address', 'email', 'city', 'phone_num', 'profile_pic', 'user_type'] 

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_phone_num(self, value):
        if len(value) != 10 or not value.isdigit():
            raise serializers.ValidationError("Phone number must be 10 digits.")
        if UserProfile.objects.filter(phone_num=value).exists():
            raise serializers.ValidationError("Phone number already exists.")
        return value

    def create(self, validated_data):
        profile = UserProfile(
            gender=validated_data.get('gender'),
            address=validated_data.get('address'),
            email=validated_data.get('email'),
            city=validated_data.get('city'),
            phone_num=validated_data.get('phone_num'),
            profile_pic=validated_data.get('profile_pic'),  
            user_type=validated_data['user_type'] 
        )

        profile.full_clean() 
        
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        profile.user = user
        profile.save()

        return profile

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

class UserSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ['username']

class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()  

    class Meta:
        model = UserProfile
        fields = ['user', 'gender', 'address', 'email', 'city', 'phone_num', 'profile_pic', 'user_type'] 

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None) 

        instance.gender = validated_data.get('gender', instance.gender)
        instance.address = validated_data.get('address', instance.address)
        instance.email = validated_data.get('email', instance.email)
        instance.city = validated_data.get('city', instance.city)
        instance.phone_num = validated_data.get('phone_num', instance.phone_num)
        instance.user_type = validated_data.get('user_type', instance.user_type)

        if 'profile_pic' in validated_data:
            instance.profile_pic = validated_data['profile_pic']

        instance.save()

        return instance



class MakeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Make
        fields = 'name'

class ModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Model
        fields = 'name'


class CarSerializer(serializers.ModelSerializer):
    make = serializers.CharField(max_length = 100)
    model = serializers.CharField(max_length = 100)
    seller = ProfileSerializer(read_only=True)  

    class Meta:
        model = Car
        fields = [
            'id',
            'make',
            'model',
            'year',
            'price',
            'description',
            'color',
            'transmission',
            'mileage',
            'condition',
            'number_of_doors',
            'location',
            'fuel_type',
            'image',
            'seller',
            'is_sold'
        ]

    def create(self, validated_data):
        make = validated_data.pop('make')
        model = validated_data.pop('model')

        make_instance, _ = Make.objects.get_or_create(name=make)
        model_instance, _ = Model.objects.get_or_create(name=model)
        user = self.context['request'].user
        seller = UserProfile.objects.get(user=user)

        car = Car.objects.create(make=make_instance, model=model_instance,seller = seller, **validated_data)
        return car

class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage
        fields = ['id', 'car', 'image_data']
        

class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only = True)
    car = CarSerializer(read_only=True)
    class Meta:
        model = Review
        fields = ['id', 'car', 'user', 'comment', 'rating', 'created_at']
        read_only_fields = ['created_at','user']

    def create(self, validated_data):
        user = self.context['request'].user
        print(validated_data)
        return Review.objects.create(user=user  ,**validated_data)


class LikedCarSerializer(serializers.ModelSerializer):
    user = ProfileSerializer(read_only=True)
    car = CarSerializer(read_only=True)
    class Meta:
        model = LikedCar
        fields = ['id', 'user', 'car']


class QuerySerializer(serializers.ModelSerializer):
    seller = ProfileSerializer(read_only=True)
    buyer = ProfileSerializer(read_only=True)

    class Meta:
        model = Query
        fields = ['id', 'seller', 'buyer', 'car', 'content', 'is_answered','response_content']


class QueryResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Query
        fields = ['id','seller', 'car', "buyer", 'content','is_answered','response_content']


class TransactionSerializer(serializers.ModelSerializer):
    car = CarSerializer(read_only=True)
    buyer = ProfileSerializer(read_only=True)
    class Meta:
        model = Transaction
        fields = ['id', 'car' ,'buyer', 'date', 'price', 'payment_id', 'payment_status', 'transaction_reference']