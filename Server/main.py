from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from decouple import config
from supabase import create_client, Client
from fastapi.responses import RedirectResponse


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
        return {"message" : "No Animals exist in the database."}
    
    return animals.data
