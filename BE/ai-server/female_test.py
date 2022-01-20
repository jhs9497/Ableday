from glob import glob
import torch
import torchvision
import torchvision.transforms as transforms
from torch.utils.data import Dataset, DataLoader
from skimage import io, transform
from glob import glob

# # 데이터셋 제작하기
# transform = transforms.Compose(
#     [transforms.ToTensor(),
#      transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])

# classes = ('bear', 'dinosour', 'dog', 'horse', 'lion', 'rabbit', 'tiger', 'wolf')

def get_label(data_path_list):
    label_list = []
    for path in data_path_list:
        # 뒤에서 두번째가 class다.
        label_list.append(path.split('\\')[-2])
    return label_list

class MyCifarSet(Dataset):
    #data_path_list - 이미지 path 전체 리스트
    #label - 이미지 ground truth
    def __init__(self, data_path_list, classes, transform=None):
        self.path_list = data_path_list
        self.label = get_label(data_path_list)
        self.transform = transform
        self.classes = classes
        


    def __len__(self):
        return len(self.path_list)

    def __getitem__(self, idx):
        if torch.is_tensor(idx):
            idx = idx.tolist()
        image = io.imread(self.path_list[idx])
        if self.transform is not None:
            image = self.transform(image)
        return image, self.classes.index(self.label[idx])

# DATA_PATH_TRAINING_LIST = glob('.\\male\\train\\*\\*.jpg')
# DATA_PATH_TESTING_LIST = glob('.\\simple_test\\male\\*\\*.jpg')

# trainloader = torch.utils.data.DataLoader(
#     MyCifarSet(
#         DATA_PATH_TRAINING_LIST, 
#         classes,
#         transform=transform
#     ),
#     batch_size=4,
#     shuffle = True
# )

# testloader = torch.utils.data.DataLoader(
#     MyCifarSet(
#         DATA_PATH_TESTING_LIST, 
#         classes,
#         transform=transform
#     ),
#     batch_size=4,
#     shuffle = False
# )


# # 합성곱신경망을 정의한다.
# import torch.nn as nn
# import torch.nn.functional as F


# class Net(nn.Module):
#     def __init__(self):
#         super().__init__()
#         self.conv1 = nn.Conv2d(3, 6, 5)
#         self.pool = nn.MaxPool2d(2, 2)
#         self.conv2 = nn.Conv2d(6, 16, 5)
#         # self.fc1 = nn.Linear(16 * 5 * 5, 120)
#         self.fc1 = nn.Linear(256, 120)
#         self.fc2 = nn.Linear(120, 84)
#         self.fc3 = nn.Linear(84, 10)

#     def forward(self, x):
#         x = self.pool(F.relu(self.conv1(x))) #여기에서 에러
#         x = self.pool(F.relu(self.conv2(x)))
#         x = torch.flatten(x, 1) # 배치를 제외한 모든 차원을 평탄화(flatten)
#         x = F.relu(self.fc1(x))
#         x = F.relu(self.fc2(x))
#         x = self.fc3(x)
#         return x

# net = Net()

# # 손실함수를 정의한다.
# import torch.optim as optim

# criterion = nn.CrossEntropyLoss()
# optimizer = optim.SGD(net.parameters(), lr=0.001, momentum=0.9)



# # 성능테스트

# dataiter = iter(testloader)
# images, labels = dataiter.next()


# # 모델을 불러옵니다.
# net = Net()
# net.load_state_dict(torch.load(".\\cifar_net_male_2.pth"))

# outputs = net(images)

# _, predicted = torch.max(outputs, 1)

# print('Predicted: ', ' '.join('%5s' % classes[predicted[j]] for j in range(1)))








# from torchvision import models
# from torchsummary import summary

# Net = models.vgg16()
# summary(Net, (3, 224, 224))
