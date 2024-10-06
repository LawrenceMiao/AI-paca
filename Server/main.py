from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from decouple import config
from supabase import create_client, Client


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

# return specific locations

# potential,


# Example API endpoint
@app.get("/api/data")
async def get_data():
    animals = supabase.table("animals").select("*").execute()
    return animals.data
