from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
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

# Root route - homepage
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request, "title": "My FastAPI Website"})

# return specific animals
@app.get("/{animal}")
async def get_animal(animal: str):
    # Query the Supabase table for the specified animal
    animal = supabase.table("animals").select("*").eq("name", animal).execute()

    # Check for any errors in the query response
    if animal.error:
        return {"error": animal.error.message}
    
    if animal.details == None:
        return {"N/A" : "Animal Does Not Exist In Database"}

    # Return the matched data
    return {"data": animal.data}

# return specific locations

# (potential) return coordinates

# Example API endpoint
@app.get("/all_data")
async def get_data():
    animals = supabase.table("animals").select("*").execute()
    return animals.data

