from decouple import config
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from supabase import Client, create_client
import io
import httpx
from datetime import datetime
import torch
from fastapi import FastAPI, File, UploadFile, Request, HTTPException, Form
from fastapi.responses import JSONResponse
from PIL import Image
from torchvision import models, transforms
from pydantic import BaseModel
import logging

logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)


# class Animal(BaseModel):
#     coordinate_x: float
#     coordinate_y: float
#     animal_label_human: str


app = FastAPI()

url = config("SUPERBASE_URL")
key = config("SUPERBASE_KEY")
geo_key = config("GEO_KEY")

IMAGE_BUCKET = "images"

supabase: Client = create_client(url, key)

# Use Jinja2Templates to render HTML templates
templates = Jinja2Templates(directory="templates")

# Serve static files (optional, if you want to add CSS/JS)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def read_root():
    """Test server running"""
    return {"message": "FastAPI application"}


# base API endpoint to get all the animals in the table
@app.get("/all_data")
async def get_data():
    animals = supabase.table("animals").select("*").execute()

    if not animals:
        return {"message": "No Animals exist in the database."}

    return animals.data


# return specific animals
@app.get("/all_data/{animal}")
async def get_animal(animal: str, request: Request):
    # Check if the animal name is not lowercase
    if animal != animal.lower():
        # Redirect to the lowercase version of the URL
        new_url = request.url.replace(path=f"/all_data/{animal.lower()}")
        return RedirectResponse(url=new_url)

    # Query the Supabase table for the specified animal
    response = supabase.table("animals").select("*").eq("animal_name", animal).execute()

    # If the animal does not exist in the database
    if not response.data:
        return {"message": "Animal does not exist in the database."}

    # Return the matched data
    return {"data": response.data}


# return specific locations

# (potential) return specific coordinates .

# change coordinates.
# DO NOT USE UNLESS NEEDED
# @app.get("/update_coordinates")
# async def update_coordinates(city: str = "dallas"):
#     # Update the coordinates for a specific city
#     response = supabase.table("animals").update({
#         "coordinate_x": 32.779167,
#         "coordinate_y": -96.808891
#     }).eq("city", city).execute()

#     return {"message": "Coordinates updated successfully", "data": response.data}


# POST endpoint to add a new animal
@app.post("/add_animal")
async def add_animal(
    coordinate_x: float = Form(...),
    coordinate_y: float = Form(...),
    animal_label_human: str = Form(...),
    image_taken: UploadFile = File(...),
):
    json_to_submit = {}

    # Upload the image to Supabase Storage
    image_data = await image_taken.read()  # Read the uploaded image
    image_path = f"images/{image_taken.filename}"  # Define the path for the image

    # Upload the image to Supabase Storage
    response = supabase.storage.from_(IMAGE_BUCKET).upload(image_path, image_data)

    # Check if upload was successful
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail="Image upload failed.")

    # Get public URL for the uploaded image
    image_url = supabase.storage.from_(IMAGE_BUCKET).get_public_url(image_path)

    # # get id
    # animals = supabase.table("animals").select("*").execute()

    # # Check if the data is empty
    # if not animals.data:
    #     return {"message": "No Animals exist in the database."}

    # sorted_animals = sorted(animals.data, key=lambda animal: animal["id"])

    # # Return the ID of the last animal
    # last_animal_id = sorted_animals[len(sorted_animals) - 1]["id"]  # Ensure 'id' exists

    # json_to_submit[id] = last_animal_id + 1

    # get timestamp of upload
    created_at = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S.%f") + "+00"
    json_to_submit["created_at"] = created_at

    image_bytes = await image_taken.read()
    input_tensor = preprocess_image(image_bytes)

    # Run the model and get prediction
    with torch.no_grad():
        output = model(input_tensor)
        predicted_idx = output.argmax(dim=1).item()

    # Get the class name
    # predicted_class = CLASS_NAMES[predicted_idx]
    predicted_class = predicted_idx
    # ASSIGN json_to_submit
    json_to_submit["animal_name"] = predicted_class

    # fill the rest of the data from the animal_data
    # for i in range(len(animal.keys()) - 1):
    #     cur_key = animal.keys()[i]
    #     if cur_key == "image_taken":
    #         json_to_submit[cur_key] = image_url
    #     else:
    #         json_to_submit[cur_key] = animal[cur_key]

    # get city and state
    geo_url = f"http://localhost:8000/geocode/?lat={coordinate_x}&lon={coordinate_y}"

    async with httpx.AsyncClient() as client:
        geocode_response = await client.get(geo_url)

        # Handle geocode response
        if geocode_response.status_code != 200:
            raise HTTPException(
                status_code=geocode_response.status_code, detail="Geocode failed"
            )

        geocode_data = geocode_response.json()
        json_to_submit["city"] = geocode_data["city"]
        json_to_submit["state"] = geocode_data["state"]

    # Insert the data into the Supabase table
    response = supabase.table("animals").insert(json_to_submit).execute()

    # Check for errors
    if response.error:
        raise HTTPException(status_code=400, detail=response.error.message)

    return {"message": "Animal added successfully", "data": response.data}


# # POST endpoint to add a new animal
# @app.get("/test_geo")
# async def test_geo():
# # get id
#     animals = supabase.table("animals").select("*").execute()

#     # Check if the data is empty
#     if not animals.data:
#         return {"message": "No Animals exist in the database."}

#     sorted_animals = sorted(animals.data, key=lambda animal: animal["id"])

#     for animal in sorted_animals:
#         print(animal["id"])
#     # Return the ID of the last animal
#     last_animal_id = sorted_animals[len(sorted_animals) - 1]["id"]  # Ensure 'id' exists

#     id = (last_animal_id + 1)


@app.get("/geocode/")
async def reverse_geocode(lat: float, lon: float):
    # Define the OpenCage API URL
    api_url = (
        f"https://api.opencagedata.com/geocode/v1/json?q={lat}+{lon}&key={geo_key}"
    )

    # Make the HTTP request
    async with httpx.AsyncClient() as client:
        response = await client.get(api_url)

    # Parse the JSON response
    data = response.json()

    if data["total_results"] == 0:
        raise HTTPException(status_code=404, detail="Location not found")

    # Extract city, state, and country from the API response
    components = data["results"][0]["components"]
    city = components.get("city") or components.get("town") or components.get("village")
    state = components.get("state")
    # country = components.get('country')

    if not city or not state:
        raise HTTPException(status_code=404, detail="City or state not found")

    return {
        "city": city.lower(),
        "state": state.lower(),
        # "country": country
    }


MODEL_DESTINATION = "resnet18_pretrained.pth"

CLASS_NAMES = [
    "coyote",
    "deer",
    "fox",
    "hummingbird",
    "owl",
    "possum",
    "raccoon",
    "snake",
    "squirrel",
    "woodpecker",
]

model = models.resnet18()
model.load_state_dict(torch.load(MODEL_DESTINATION, weights_only=True))
model.eval()

# Define transformation to be applied to incoming images (similar to training)
transform = transforms.Compose(
    [
        transforms.Resize((128, 128)),  # Adjust to the size you trained your model with
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ]
)


# Helper function to preprocess the image
def preprocess_image(image_bytes):
    """_summary_

    Args:
        image_bytes (_type_): _description_

    Returns:
        _type_: _description_
    """
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return transform(image).unsqueeze(0)  # Add batch dimension


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """_summary_

    Args:
        file (UploadFile, optional): _description_. Defaults to File(...).

    Returns:
        _type_: _description_
    """
    # Read the image file
    image_bytes = await file.read()
    input_tensor = preprocess_image(image_bytes)

    # Run the model and get prediction
    with torch.no_grad():
        output = model(input_tensor)
        predicted_idx = output.argmax(dim=1).item()

    # Get the class name
    # predicted_class = CLASS_NAMES[predicted_idx]
    predicted_class = predicted_idx

    # Return the prediction as a JSON response
    return JSONResponse({"prediction": predicted_class})
