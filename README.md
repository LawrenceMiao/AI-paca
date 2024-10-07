# AI-paca

Users can use the AI-paca mobile application to take pictures of animal sightings. When they submit entries, the images get analyzed by a deep learning classifier to automatically identify the species of the animal(s). This data is consolidated and researchers can access, visualize, and download the data through a website interface. In short, AI-paca allows mobile users to contribute to environmental conservation efforts through a mobile app and gives researchers access to a larger pool of crucial ecological data.

## Anatomy

```
AI-paca/
├── Classifier/ # Model generation code (not to be deployed).
├── Server/ # API endpoints
├── Mobile/ # Mobile app
└── Web/ # Web visualization
```

## Running server in dev

Run command

```bash
cd Server
pip install requirements.txt
```

Start server

```bash
uvicorn main:app --reload
```
