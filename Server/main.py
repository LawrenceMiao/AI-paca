from decouple import config
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from supabase import Client, create_client
import io
import httpx
import torch
from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.responses import JSONResponse
from PIL import Image
from torchvision import models, transforms
from pydantic import BaseModel

class Animal(BaseModel):
    coordinate_x: float
    coordinate_y: float
    image_taken: str
    city: str
    state: str
    animal_name: str

app = FastAPI()

url = config("SUPERBASE_URL")
key = config("SUPERBASE_KEY")
geo_key = config("GEO_KEY")

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
@app.get("/all_data/animal={animal}")
async def get_animal(animal: str, request: Request):
    # Check if the animal name is not lowercase
    if animal != animal.lower():
        # Redirect to the lowercase version of the URL
        new_url = request.url.replace(path=f"/all_data/animal={animal.lower()}")
        return RedirectResponse(url=new_url)

    # Query the Supabase table for the specified animal
    response = supabase.table("animals").select("*").eq("animal_name", animal).execute()

    # If the animal does not exist in the database
    if not response.data:
        return {"message": "Animal does not exist in the database."}

    # Return the matched data
    return {"data": response.data}


# return specific locations
@app.get("/all_data/city={city}&state={state}")
async def get_animal(city: str, state: str, request: Request):
    # Check if the city or state name is not lowercase
    if city != city.lower() or state != state.lower():
        # Redirect to the lowercase version of the URL
        new_url = request.url.replace(path=f"/all_data/city={city.lower()}&state={state.lower()}")
        return RedirectResponse(url=new_url)

    # Query the Supabase table for the specified city and state
    response = supabase.table("animals").select("*").eq("city", city).eq("state", state).execute()

    # If the animal does not exist in the database
    if not response.data:
        return {"message": "No animals exist in the database for selected city and state."}

    # Return the matched data
    return {"data": response.data}


@app.get("/all_data/city={city}")
async def get_animal(city: str, request: Request):
    # Check if the city or state name is not lowercase
    if city != city.lower():
        # Redirect to the lowercase version of the URL
        new_url = request.url.replace(path=f"/all_data/city={city.lower()}")
        return RedirectResponse(url=new_url)

    # Query the Supabase table for the specified city and state
    response = supabase.table("animals").select("*").eq("city", city).execute()

    # If the animal does not exist in the database
    if not response.data:
        return {"message": "No animals exist in the database for selected city."}

    # Return the matched data
    return {"data": response.data}


@app.get("/all_data/state={state}")
async def get_animal(state: str, request: Request):
    # Check if the city or state name is not lowercase
    if state != state.lower():
        # Redirect to the lowercase version of the URL
        new_url = request.url.replace(path=f"/all_data/state={state.lower()}")
        return RedirectResponse(url=new_url)

    # Query the Supabase table for the specified city and state
    response = supabase.table("animals").select("*").eq("state", state).execute()

    # If the animal does not exist in the database
    if not response.data:
        return {"message": "No animals exist in the database for selected state."}

    # Return the matched data
    return {"data": response.data}


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
async def add_animal(animal: Animal):
    # Access the body data directly from the animal parameter
    animal_data = animal.dict()  # Convert Pydantic model to dict

    # Insert the data into the Supabase table
    response = supabase.table("animals").insert(animal_data).execute()

    # Check for errors
    if response.error:
        raise HTTPException(status_code=400, detail=response.error.message)

    return {"message": "Animal added successfully", "data": response.data}


@app.get("/geocode/?lat={lat}&lon={lon}")
async def reverse_geocode(lat: float, lon: float):
    # Define the OpenCage API URL
    api_url = f"https://api.opencagedata.com/geocode/v1/json?q={lat}+{lon}&key={geo_key}"

    # Make the HTTP request
    async with httpx.AsyncClient() as client:
        response = await client.get(api_url)

    # Parse the JSON response
    data = response.json()

    if data['total_results'] == 0:
        raise HTTPException(status_code=404, detail="Location not found")

    # Extract city, state, and country from the API response
    components = data['results'][0]['components']
    city = components.get('city') or components.get('town') or components.get('village')
    state = components.get('state')
    country = components.get('country')

    if not city or not state:
        raise HTTPException(status_code=404, detail="City or state not found")

    return {
        "city": city,
        "state": state,
        "country": country
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
