import torch
import torch.nn as nn
import torchvision.models as models
from torchvision import datasets, transforms
from torch.utils.data import Dataset
from torch.utils.data import DataLoader

# Load pre-trained ResNet-18 model
model = models.resnet18(pretrained=True)

# Modify the final fully connected layer to have 10 output nodes
num_features = model.fc.in_features
model.fc = nn.Linear(num_features, 10)  # 10 output classes

# Freeze the feature extractor (all layers except the final layer)
for param in model.parameters():
    param.requires_grad = False

# Ensure that the final fully connected layer is still trainable
for param in model.fc.parameters():
    param.requires_grad = True

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

model = model.to(device)
print(model)


loss_fn = nn.CrossEntropyLoss()
optimizer = torch.optim.Adam(model.fc.parameters(), lr=0.001)


transform = transforms.Compose([transforms.Resize((224, 224)), transforms.ToTensor()])

train_dir = "dataset"

train_dataset = datasets.ImageFolder(root=train_dir, transform=transform)


def train(model, train_loader, validation_loader):
    model.train()
    for batch, (X, y) in enumerate(train_loader):
        X, y = X.to(device), y.to(device)

        # Forward
        out = model(X)
        loss = loss_fn(out, y)

        # Backward
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()


def validate(model, validation_loader):
    model.eval()
    val_loss = 0.0
    correct_predictions = 0
    total = 0

    with torch.no_grad():
        for batch, (X, y) in enumerate(validation_loader):
            X, y = X.to(device), y.to(device)

            out = model(X)
            loss = loss_fn(out, y)
            val_loss += loss.item()

            preds = torch.sigmoid(out) > 0.5
            correct_predictions += (preds == y).sum().item()
            total += y.numel()

    accuracy = correct_predictions / total
    print(
        f"Validation Loss: {val_loss/len(validation_loader):.2f}, Accuracy: {accuracy:.2f}"
    )


train_loader = DataLoader(train_dataset, batch_size=32, shuffle=True)
validation_loader = DataLoader(validation_dataset, batch_size=32, shuffle=False)

num_epochs = 5

for epoch in range(num_epochs):
    print(f"Epoch [{epoch+1}/{num_epochs}]")
    train(model, train_loader, validation_loader)
    validate(model, validation_loader)
