import csv
from datetime import datetime
import random

# Example data points (animal, city, state)
animals = [ "coyote", "deer", "fox", "hummingbird", "owl", "possum", "raccoon", "snake", "squirrel", "woodpecker",]
cities = ["chicago", "new york", "los angeles", "houston", "phoenix", "philadelphia", "san antonio", "dallas"]
states = ["illinois", "new york", "california", "texas", "arizona", "pennsylvania", "texas", "texas"]

# Generate random coordinates
def generate_coordinates():
    return round(random.uniform(-90, 90), 4), round(random.uniform(-180, 180), 4)

# Generate the CSV data
def generate_csv_data(file_name="animals_data.csv"):
    with open(file_name, mode='w', newline='') as file:
        writer = csv.writer(file)
        # Write the header
        writer.writerow(["id", "created_at", "city", "coordinate_x", "coordinate_y", "image_taken", "state", "animal_name"])
        
        # Generate and write 20 rows of random data
        for i in range(3, 101):
            created_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S.%f") + "+00"
            city = random.choice(cities)
            state = states[cities.index(city)]
            animal_name = random.choice(animals)
            coordinate_x, coordinate_y = generate_coordinates()
            image_taken = "some link"
            
            writer.writerow([i, created_at, city, coordinate_x, coordinate_y, image_taken, state, animal_name])

# Call the function to generate CSV
generate_csv_data("animals_data.csv")
