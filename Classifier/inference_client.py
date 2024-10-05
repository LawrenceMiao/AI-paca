import requests


def send_image(file_path):
    url = "http://127.0.0.1:8000/predict"  # Replace with the correct API endpoint
    files = {"file": open(file_path, "rb")}

    try:
        response = requests.post(url, files=files)
        response.raise_for_status()  # Raise an exception for any HTTP error codes
        prediction = response.json()
        print(f"Prediction: {prediction['prediction']}")
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    image_path = "snake.jpg"  # Replace with the path to the image you want to send
    send_image(image_path)
