import os
import pandas as pd
from django.contrib.auth.models import User
from .models import UserProfile, Car, Make, Model

def uploadData():
    # Construct the path to the CSV file
    csv_file_path = os.path.join(os.path.dirname(__file__), 'data.csv')

    # Load the data from the CSV file
    data = pd.read_csv(csv_file_path)

    for index, row in data.iterrows():
        print(row)  # Debugging line

        # Skip rows with missing required fields
        if pd.isna(row['seller']) or pd.isna(row['make']) or pd.isna(row['model']) or pd.isna(row['year']):
            print(f"Skipping row {index} due to missing required fields.")
            continue

        # Get the seller based on the username
        try:
            seller_profile = UserProfile.objects.get(user__username=row['seller'])
        except UserProfile.DoesNotExist:
            print(f"Seller {row['seller']} does not exist. Skipping row {index}.")
            continue

        # Get or create the Make object
        make_instance, created = Make.objects.get_or_create(name=row['make'])
        if created:
            print(f"Created new Make: {row['make']}")

        # Get or create the Model object
        model_instance, created = Model.objects.get_or_create(name=row['model'])
        if created:
            print(f"Created new Model: {row['model']}")

        # Prepare the Car data
        car_data = {
            'details': row['details'] if not pd.isna(row['details']) else '',
            'make': make_instance,
            'model': model_instance,
            'year': int(row['year']),
            'price': float(row['price']),
            'description': row['description'] if not pd.isna(row['description']) else '',
            'seller': seller_profile,
            'color': row['color'] if not pd.isna(row['color']) else '',
            'transmission': row['transmission'] if not pd.isna(row['transmission']) else 'Manual',  # Default to Manual
            'mileage': int(row['mileage']) if not pd.isna(row['mileage']) else 0,
            'condition': row['condition'] if not pd.isna(row['condition']) else 'Used',  # Default to Used
            'number_of_doors': int(row['number_of_doors']) if not pd.isna(row['number_of_doors']) else 4,
            'location': row['location'] if not pd.isna(row['location']) else '',
            'fuel_type': row['fuel_type'] if not pd.isna(row['fuel_type']) else 'Petrol',  # Default to Petrol
            'image': row['image'] if not pd.isna(row['image']) else None  # Use the image from the CSV
        }

        # Create or update the Car object
        Car.objects.update_or_create(
            make=make_instance,
            model=model_instance,
            year=car_data['year'],
            defaults=car_data
        )

    print("Car data added successfully.")
