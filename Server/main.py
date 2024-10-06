from decouple import config
from fastapi.responses import RedirectResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from supabase import Client, create_client
import io

import torch
from fastapi import FastAPI, File, UploadFile, Request
from fastapi.responses import JSONResponse
from PIL import Image
from torchvision import models, transforms


app = FastAPI()

url = config("SUPERBASE_URL")
key = config("SUPERBASE_KEY")

supabase: Client = create_client(url, key)

# Use Jinja2Templates to render HTML templates
templates = Jinja2Templates(directory="templates")

# Serve static files (optional, if you want to add CSS/JS)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def read_root():
    """Test server running"""
    return {"message": "FastAPI application"}


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


# base API endpoint to get all the animals in the table
@app.get("/all_data")
async def get_data():
    animals = supabase.table("animals").select("*").execute()

    if not animals:
        return {"message": "No Animals exist in the database."}

    return animals.data


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


@app.post("/predict_mock")
async def predict_mock(file: UploadFile = File(...)):
    """Stand in for predict"""
    return JSONResponse({"prediction": "mock animal"})
