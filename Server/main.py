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

# Example API endpoint
@app.get("/api/data")
async def get_data():
    animals = supabase.table("animals").select("*").execute()
    print(animals.data)
    return {"data" : animals.json}

