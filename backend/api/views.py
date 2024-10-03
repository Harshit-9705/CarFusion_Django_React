from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login as auth_login
from django.contrib.auth.models import User
from .models import *
from .serializers import *
from django.db.models import Q
from rest_framework.permissions import IsAuthenticated
import razorpay
from django.conf import settings
import hmac
import hashlib
from decimal import Decimal


class SignUpView(APIView):
    def post(self, request):
        serializer = SignUpSerializer(data=request.data)
        if serializer.is_valid():
            user = User.objects.create_user(
                username=serializer.validated_data['username'],
                email=serializer.validated_data['email'],
                password=serializer.validated_data['password']
            )

            profile = UserProfile.objects.create(
                user=user,
                gender=serializer.validated_data.get('gender'),
                address=serializer.validated_data.get('address'),
                email=serializer.validated_data['email'],  
                city=serializer.validated_data.get('city'),
                phone_num=serializer.validated_data.get('phone_num'),
                profile_pic=request.FILES.get('profile_pic'),  
                user_type=serializer.validated_data['user_type']  
            )

            token, created = Token.objects.get_or_create(user=user)

            return Response({
                'username': user.username,
                'email': user.email,
                'token': token.key,
                'gender': profile.gender,
                'address': profile.address,
                'city': profile.city,
                'phone_num': profile.phone_num,
                'user_type': profile.user_type,  
                'message': 'User created successfully. Please verify your email.'
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            if user:
                auth_login(request, user)
                token, created = Token.objects.get_or_create(user=user)
                profile = UserProfile.objects.get(user=user)
                return Response({
                    'message': 'Login successful',
                    'username': user.username,
                    'token': token.key,
                    'user_type': profile.user_type  
                }, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            profile = UserProfile.objects.get(user=user)
            serializer = ProfileSerializer(profile)

            response_data = {
                **serializer.data,
                'cars_sold': [],
                'liked_cars': [],
                'cars_bought': [],
                'buyed' : []
            }
            if profile.user_type == 'seller':
                transactions = Transaction.objects.filter(car__seller=profile) 
                cars_sold = []  
                for transaction in transactions:
                    car = CarSerializer(transaction.car).data
                    date = transaction.date
                    
                    cars_sold.append({
                        "car": car,
                        "date": date,
                    })

                response_data['cars_sold'] = cars_sold
                unsold_cars = Car.objects.filter(seller=profile, is_sold=False)
                unsold_cars_serializer = CarSerializer(unsold_cars, many=True)
                response_data['buyed'] = unsold_cars_serializer.data  


            elif profile.user_type == 'buyer':
                transactions = Transaction.objects.filter(buyer=profile) 
                cars_bought = []  
                for transaction in transactions:
                    car = CarSerializer(transaction.car).data
                    date = transaction.date
                    
                    cars_bought.append({
                        "car": car,
                        "date": date,
                    })

                response_data['cars_bought'] = cars_bought  


                liked_cars = LikedCar.objects.filter(user=profile)
                response_data['liked_cars'] = CarSerializer([like.car for like in liked_cars], many=True).data

            return Response(response_data)

        except UserProfile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)


    def put(self, request):
        user = request.user
        try:
            profile = UserProfile.objects.get(user=user)
        except UserProfile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        user.email = request.data.get('email', user.email)
        user.save()

        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = request.auth
            if token:
                token.delete()
                return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'No token provided.'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CarRegisterView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        try:
            car = Car.objects.filter(is_sold=False)
            serializer = CarSerializer(car,many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Car.DoesNotExist:
            return Response({"error": "Car not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request):
        serializer = CarSerializer(data=request.data, context={'request': request})
         
        user = UserProfile.objects.get(user=request.user)
        if(user.user_type == "buyer"):
            return Response({"error":"You Can Not Add The Car"}, status=status.HTTP_400_BAD_REQUEST)
         
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CarView(APIView):
    def get(self, request, pk):
        try:
            car = Car.objects.get(id=pk)
            serializer = CarSerializer(car)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Car.DoesNotExist:
            return Response({"error": "Car not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            car = Car.objects.get(id=pk)  
            serializer = CarSerializer(car, data=request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Car.DoesNotExist:
            return Response({"error": "Car not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self, request, pk):
        try:
            car = Car.objects.get(id=pk)
            car.delete()
            return Response({"message": "Car deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

        except Car.DoesNotExist:
            return Response({"error": "Car not found"}, status=status.HTTP_404_NOT_FOUND)


class CarSuggestion(APIView):
    def get(self, request, pk, format=None):
        try:
            car = Car.objects.get(pk=pk)
        except Car.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        similar_cars = Car.objects.filter(
            Q(make=car.make) |
            Q(model=car.model) |
            Q(location=car.location) |
            Q(mileage__range=(car.mileage - 5, car.mileage + 5)) |
            Q(fuel_type=car.fuel_type) |
            Q(transmission=car.transmission) |
            Q(color=car.color)
        ).exclude(pk=pk)[:4]

        serializer = CarSerializer(similar_cars, many=True)
        return Response(serializer.data)


class CarImageListView(APIView):
    def get(self, request, car_id):
        images = CarImage.objects.filter(car_id=car_id)
        serializer = CarImageSerializer(images, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, car_id):
        files = request.FILES.getlist('images')  
        car_images = []
        for file in files:
            car_image = CarImage(car_id=car_id, image_data=file)
            car_images.append(car_image)

        CarImage.objects.bulk_create(car_images)

        return Response({"message": "Images uploaded successfully!"}, status=status.HTTP_201_CREATED)

class ReviewListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, car_id):
        reviews = Review.objects.filter(car__id=car_id)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)

    def post(self, request, car_id):
        car = Car.objects.get(id = car_id) 
        user = UserProfile.objects.get(user=request.user)
        if(user.user_type == "seller"):
            return Response({"error":"You can not review car"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = ReviewSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(car = car)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LikedCarListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = UserProfile.objects.get(user = request.user) 
            if (user.user_type == "seller"):
                return Response({"detail": "You Can Not Allow This Option As Seller."}, status=status.HTTP_404_NOT_FOUND)

        except UserProfile.DoesNotExist:
            return Response({"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)

        liked_cars = LikedCar.objects.filter(user=user)
        serializer = LikedCarSerializer(liked_cars, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


    def post(self, request):
        try:
            user = UserProfile.objects.get(user=request.user) 

            car_id = request.data.get('car')
            car_instance = Car.objects.get(id=car_id)

            if car_instance.seller == user :
                return Response({"detail":"You Can Not Like Your Own Car"},status=status.HTTP_400_BAD_REQUEST)

            liked_car, created = LikedCar.objects.get_or_create(user=user, car=car_instance)
            if created:
                serializer = LikedCarSerializer(liked_car)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response({"detail": "You have already liked this car."}, status=status.HTTP_400_BAD_REQUEST)

        except UserProfile.DoesNotExist:
            return Response({"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)
        except Car.DoesNotExist:
            return Response({"detail": "Car not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def delete(self, request, car_id):
        try:
            user = UserProfile.objects.get(user=request.user)
            liked_car = LikedCar.objects.get(user=user, car_id=car_id)
            liked_car.delete()
            return Response({"detail": "Liked car removed successfully."}, status=status.HTTP_204_NO_CONTENT)

        except UserProfile.DoesNotExist:
            return Response({"detail": "User profile not found."}, status=status.HTTP_404_NOT_FOUND)
        except LikedCar.DoesNotExist:
            return Response({"detail": "Liked car not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateOrderAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        amount = request.data.get('amount')

        user_profile = UserProfile.objects.get(user=request.user)

        car_id = request.data.get('car_id')  

        if not amount:
            return Response({'error': 'Amount is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            car = Car.objects.get(id=car_id)
        except Car.DoesNotExist:
            return Response({'error': 'Car not found'}, status=status.HTTP_404_NOT_FOUND)


        if car.seller == user_profile:
            return Response({'error': 'You cannot buy your own car'}, status=status.HTTP_403_FORBIDDEN)

        discount_user_valid = Transaction.objects.filter(buyer=user_profile).exists()

        if discount_user_valid:
            amount = amount 
        else:
            amount = amount * 0.95

        razorpay_client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_SECRET_KEY))

        try:
            order = razorpay_client.order.create({
                'amount': amount * 1,  
                'currency': 'INR',
                'payment_capture': '1'  
            })
            return Response(order, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class VerifyPaymentAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        razorpay_order_id = data.get('razorpay_order_id')
        razorpay_payment_id = data.get('razorpay_payment_id')
        razorpay_signature = data.get('razorpay_signature')
        car_id = data.get('car_id')

        generated_signature = hmac.new(
            key=settings.RAZORPAY_SECRET_KEY.encode('utf-8'),
            msg=f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8'),
            digestmod=hashlib.sha256
        ).hexdigest()

        if generated_signature == razorpay_signature:
            try:
                car = Car.objects.get(id=car_id)
            except Car.DoesNotExist:
                return Response({'error': 'Car not found'}, status=status.HTTP_404_NOT_FOUND)

            user_profile = UserProfile.objects.get(user=request.user)

            if car.seller == user_profile:
                return Response({'error': 'You cannot buy your own car'}, status=status.HTTP_403_FORBIDDEN)

            discount_user_valid = Transaction.objects.filter(buyer=user_profile).exists()
            final_price = Decimal(car.price)

            if not discount_user_valid:
                final_price = final_price * Decimal(0.95) 
            

            car.is_sold = True  
            car.save()

            transaction = Transaction.objects.create(
                buyer=user_profile,
                car=car,
                price=final_price,
                payment_id=razorpay_payment_id, 
                payment_status='completed',  
                transaction_reference=razorpay_order_id,
            )
            return Response({'status': 'Payment verified', 'final_price': final_price}, status=status.HTTP_200_OK)
        else:
            return Response({'status': 'Payment verification failed'}, status=status.HTTP_400_BAD_REQUEST)


class QueryCreateView(APIView):
    permission_classes = [IsAuthenticated] 

    def post(self, request, id):
        try:
            car = Car.objects.get(id=id)
        except Car.DoesNotExist:
            return Response({'error': 'Car not found.'}, status=status.HTTP_404_NOT_FOUND)

        user_profile = UserProfile.objects.get(user=request.user)

        if user_profile.user_type == "seller":
            return Response({'error': 'You cannot send a query for car.'}, status=status.HTTP_403_FORBIDDEN)

        query_data = {
            'buyer': user_profile.id,
            'seller': car.seller.id,
            'car': car.id,
            'content': request.data.get('content', ''),
        }

        serializer = QueryResponseSerializer(data=query_data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QueryResponseView(APIView):
    permission_classes = [IsAuthenticated] 

    def post(self, request, id):
        try:
            query = Query.objects.get(id=id)
        except Query.DoesNotExist:
            return Response({'error': 'Query not found.'}, status=status.HTTP_404_NOT_FOUND)

        if request.user == query.buyer.user:
            query.read = True
            query.save()
            return Response({"message":"Query Marked SuccessFully"},status=status.HTTP_200_OK)

        if request.user != query.seller.user:
            return Response({'error': 'You are not authorized to respond to this query.'}, status=status.HTTP_403_FORBIDDEN)

        query.response_content = request.data.get('content', '')
        query.is_answered = True
        query.save()

        return Response({'message': 'Response saved successfully.'}, status=status.HTTP_201_CREATED)


class QueryListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_profile = UserProfile.objects.get(user=request.user)
        except UserProfile.DoesNotExist:
            return Response({'error': 'User profile not found.'}, status=status.HTTP_404_NOT_FOUND)

        queries = Query.objects.filter(seller=user_profile,is_answered=False) if user_profile.user_type == 'seller' else Query.objects.filter(buyer=user_profile,read=False,is_answered=True)

        serializer = QuerySerializer(queries, many=True)
        
        for query_data in serializer.data:
            query_data['response_content'] = query_data.get('response_content', None)

        return Response(serializer.data, status=status.HTTP_200_OK)


class TransactionView(APIView):
    def get(self, request):
        try:
            user = UserProfile.objects.get(user=request.user)

            # Fetch transactions based on user type
            if user.user_type == "seller":
                transactions = Transaction.objects.filter(car__seller=user)  # Assuming car has a seller field
            else:
                transactions = Transaction.objects.filter(buyer=user)

            serializer = TransactionSerializer(transactions, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except UserProfile.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
