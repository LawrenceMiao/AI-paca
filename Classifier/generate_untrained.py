"""Load and save pretrained (not-finetuned) classifier model"""

import torch
import torchvision.models as models

model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

model.eval()
torch.save(model.state_dict(), "resnet18_pretrained.pth")
