import io

import torch
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from PIL import Image
from torchvision import models, transforms


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
]  # Change these to your actual class names

# Initialize FastAPI
app = FastAPI()

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


# Start the FastAPI server
# To run this use `uvicorn inference:app --reload`
