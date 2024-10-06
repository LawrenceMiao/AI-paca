import os

import torch
import torch.nn as nn
import torchvision.models as models
from PIL import Image
from torchvision import datasets, transforms

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

# Check the model architecture (optional)
print(model)

# Task 2


# class AnimalDataset(Dataset):
#     def __init__(self, root_dir, transform):
#         self.transform = transform
#         self.dataset = datasets.ImageFolder(root=root_dir, transform=transform)

#     def __len__(self):
#         return len(self.datapoints)

#     def __getitem__(self, idx):
#         image = self.transform(
#             Image.open(os.path.join(self.src, self.datapoints[idx][0]))
#         )
#         label = torch.tensor(
#             [self.datapoints[idx][1], self.datapoints[idx][2]], dtype=torch.float32
#         )
#         return image, label


transform = transforms.Compose([transforms.Resize((224, 224)), transforms.ToTensor()])

train_dir = "dataset/animals"

train_dataset = datasets.ImageFolder(root=train_dir, transform=transform)
