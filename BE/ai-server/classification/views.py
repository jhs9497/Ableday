from django.shortcuts import render, redirect
from PIL import Image
from preprocessing import preprocessing_face_cascade
from preprocessing_emotion import preprocessing_face_cascade_emotion
from glob import glob

import torch
import torchvision
import torchvision.transforms as transforms
from torch.utils.data import Dataset, DataLoader
from skimage import io, transform

from female_test import get_label
from female_test import MyCifarSet
import torch.nn as nn
import torch.nn.functional as F
import torch.optim as optim

from django.http  import JsonResponse

from django.views.decorators.csrf import csrf_exempt

import json

import base64
from PIL import Image
from io import BytesIO
import matplotlib.pyplot as plt

import os
# Create your views here.
def saveimage(path, gender):
    # print(path)
    image = Image.open(path)
    image_convert = image.convert("RGB")
    image_convert.save('/home/ubuntu/S05P21C105/BE/ai-server/classification/data/' + gender + '/inputimage.jpg')
    return None
# /home/ubuntu/S05P21C105/BE/ai-server/

def saveimage_emotion(path):
    image = Image.open(BytesIO(base64.b64decode(path)))
    # image = Image.open(path)
    image_convert = image.convert("RGB")
    os.remove('/home/ubuntu/S05P21C105/BE/ai-server/classification/data_emotion/inputimage.jpg')
    # width, height = image_convert.size
    # print(height)
    # print(width, height)
    # image_convert = image_convert.resize((int(image_convert.width * 2), int(image_convert.height * 2)))
    # width, height = image_convert.size
    # print(width, height)
    image_convert.save('/home/ubuntu/S05P21C105/BE/ai-server/classification/data_emotion/inputimage.jpg')
    # with open('/home/ubuntu/S05P21C105/BE/ai-server/classification/data_emotion/inputimage.jpg', 'rb') as img:
    #     base64_string = base64.b64encode(img.read())
    # print(str(base64_string)[:300])
    return None

transform = transforms.Compose(
    [transforms.ToTensor(),
     transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])

def get_label(data_path_list):
    label_list = []
    for path in data_path_list:
        # 뒤에서 두번째가 class다.
        label_list.append(path.split('/')[-2])
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



def index(request):
    return render(request, 'classification/index.html')

def male(request):
    return render(request, 'classification/male.html')

def female(request):
    return render(request, 'classification/female.html')

def imageinput(request):
    return render(request, 'classification/imageinput.html')

def imagechoice(request):
    # data받기
    gender = request.POST['gender']
    path = request.POST['path']


    saveimage(path, gender)
    # 전처리
    try:
        count = preprocessing_face_cascade(gender)
        print(count)
        # if count == 0:
        #     # print("얼굴없음")
        # elif count == 1:
        #     pass
        #     # print("얼굴 1")
        # else:
        #     pass
        #     # print("얼굴많음")
        # # print("전처리함")
        
    except:
        print("전처리실패함")
    if gender == 'male':
        classes = ('bear', 'dinosour', 'dog', 'horse', 'rabbit', 'wolf')
    elif gender == 'female':
        classes = ('cat', 'deer', 'dog', 'fox', 'rabbit', 'squirtle')
    # print(classes)
    # 이미지분류
    DATA_PATH_TESTING_LIST = glob('.\\classification\\preprocessed\\'+ gender +'\\*\\*.jpg')
    # print(DATA_PATH_TESTING_LIST)

    testloader = torch.utils.data.DataLoader(
        MyCifarSet(
            DATA_PATH_TESTING_LIST, 
            classes,
            transform=transform
        ),
        batch_size=4,
        shuffle = False
    )
    class Net(nn.Module):
        def __init__(self):
            super().__init__()
            self.conv1 = nn.Conv2d(3, 6, 5)
            self.pool = nn.MaxPool2d(2, 2)
            self.conv2 = nn.Conv2d(6, 16, 5)
            self.fc1 = nn.Linear(256, 120)
            self.fc2 = nn.Linear(120, 84)
            self.fc3 = nn.Linear(84, 10)

        def forward(self, x):
            x = self.pool(F.relu(self.conv1(x))) 
            x = self.pool(F.relu(self.conv2(x)))
            x = torch.flatten(x, 1) 
            x = F.relu(self.fc1(x))
            x = F.relu(self.fc2(x))
            x = self.fc3(x)
            return x

    net = Net()

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(net.parameters(), lr=0.001, momentum=0.9)


    dataiter = iter(testloader)
    images, labels = dataiter.next()

    net = Net()
    if gender == 'female':
        net.load_state_dict(torch.load(".\\classification\\cifar_net_female_2.pth"))
    elif gender == 'male':
        net.load_state_dict(torch.load(".\\classification\\cifar_net_male_3.pth"))
    # net.load_state_dict(torch.load(".\\classification\\cifar_net_female_2.pth"))
    outputs = net(images)

    _, predicted = torch.max(outputs, 1)

    # print('Predicted: ', ' '.join('%s' % classes[predicted[j]] for j in range(1)))

    result = ' '.join('%s' % classes[predicted[j]] for j in range(1))

    if result == 'dinosour':
        result = 'dinosaur'
    image_path_input = './classification/data/' + gender + '/inputimage.jpg'
    image_path_dog = './classification/preprocessed/' + gender + '/dog/1.jpg'
    context = {
        'result': result,
        'gender': gender,
        'image_path_input': image_path_input,
        'image_path_dog': image_path_dog,        
    }
    # return render(request, 'classification/resultoutput.html', context)
    json_object = { 'result': result, 'gender': gender}
    return JsonResponse(json_object)

@csrf_exempt
def resultoutput(request):
    # data받기
    gender = json.loads(request.body)['gender'][0]
    path = json.loads(request.body)['path'][0]
    # gender = request.POST.get("gender", None)
    # path = request.POST.get("path", None)
    # gender = request.POST['gender']
    # # # print(request.POST)
    # path = request.POST['path']

    # gender = request.POST.get("gender")
    # path = request.POST.get("path")
    # print("mmmmmmmmmmmmmmmmmmm")
    print(gender, path)
    # gender = request.headers['gender']
    # path = request.headers['path']

    saveimage(path, gender)
    # 전처리
    try:
        count = preprocessing_face_cascade(gender)
        # if count == 0:
        #     print("얼굴없음")
        # elif count == 1:
        #     print("얼굴 1")
        # else:
        #     print("얼굴많음")
        # print("전처리함")
        
    except:
        pass
        # print("전처리실패함")
    if gender == 'male':
        classes = ('bear', 'dinosour', 'dog', 'horse', 'rabbit', 'wolf')
    elif gender == 'female':
        classes = ('cat', 'deer', 'dog', 'fox', 'rabbit', 'squirtle')
    # print(classes)
    # 이미지분류
    DATA_PATH_TESTING_LIST = ['classification/preprocessed/female/dog/1.jpg']
    # print(DATA_PATH_TESTING_LIST)

    testloader = torch.utils.data.DataLoader(
        MyCifarSet(
            DATA_PATH_TESTING_LIST, 
            classes,
            transform=transform
        ),
        batch_size=4,
        shuffle = False
    )
    class Net(nn.Module):
        def __init__(self):
            super().__init__()
            self.conv1 = nn.Conv2d(3, 6, 5)
            self.pool = nn.MaxPool2d(2, 2)
            self.conv2 = nn.Conv2d(6, 16, 5)
            self.fc1 = nn.Linear(256, 120)
            self.fc2 = nn.Linear(120, 84)
            self.fc3 = nn.Linear(84, 10)

        def forward(self, x):
            x = self.pool(F.relu(self.conv1(x))) 
            x = self.pool(F.relu(self.conv2(x)))
            x = torch.flatten(x, 1) 
            x = F.relu(self.fc1(x))
            x = F.relu(self.fc2(x))
            x = self.fc3(x)
            return x

    net = Net()

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(net.parameters(), lr=0.001, momentum=0.9)


    dataiter = iter(testloader)
    images, labels = dataiter.next()

    net = Net()
    if gender == 'female':
        net.load_state_dict(torch.load("/home/ubuntu/S05P21C105/BE/ai-server/classification/cifar_net_female_2.pth"))
    elif gender == 'male':
        net.load_state_dict(torch.load("/home/ubuntu/S05P21C105/BE/ai-server/classification/cifar_net_male_3.pth"))
    # net.load_state_dict(torch.load(".\\classification\\cifar_net_female_2.pth"))
    outputs = net(images)

    _, predicted = torch.max(outputs, 1)

    # print('Predicted: ', ' '.join('%s' % classes[predicted[j]] for j in range(1)))

    result = ' '.join('%s' % classes[predicted[j]] for j in range(1))

    if result == 'dinosour':
        result = 'dinosaur'
    if count == 0:
        result == "None"
    print(result)
    image_path_input = '/home/ubuntu/S05P21C105/BE/ai-server/classification/data/' + gender + '/inputimage.jpg'
    image_path_dog = '/home/ubuntu/S05P21C105/BE/ai-server/classification/preprocessed/' + gender + '/dog/1.jpg'
    context = {
        'result': result,
        'gender': gender,
        'image_path_input': image_path_input,
        'image_path_dog': image_path_dog,        
    }
    # return render(request, 'classification/resultoutput.html', context)
    json_object = { 'result': result, 'gender': gender}
    return JsonResponse(json_object)


def emotion(request):
    return render(request, 'classification/emotion.html')

def emotioninput(request):
    return render(request, 'classification/emotioninput.html')

def emotionchoice(request):
    # data받기
    path = request.POST['path']


    height = saveimage_emotion(path)
    # 전처리
    try:
        count = preprocessing_face_cascade_emotion(height)
        # if count == 0:
        #     print("얼굴없음")
        # elif count == 1:
        #     print("얼굴 1")
        # else:
        #     print("얼굴많음")
        # print("전처리함")
        
    except:
        pass
        # print("전처리실패함")

    classes = ('anger', 'anxiety', 'joy', 'neutral', 'panic', 'sadness', 'wound')
    # print(classes)
    # 이미지분류
    DATA_PATH_TESTING_LIST = glob('.\\classification\\preprocessed_emotion\\*\\*.jpg')
    # print(DATA_PATH_TESTING_LIST)

    testloader = torch.utils.data.DataLoader(
        MyCifarSet(
            DATA_PATH_TESTING_LIST, 
            classes,
            transform=transform
        ),
        batch_size=4,
        shuffle = False
    )
    class Net(nn.Module):
        def __init__(self):
            super().__init__()
            self.conv1 = nn.Conv2d(3, 6, 5)
            self.pool = nn.MaxPool2d(2, 2)
            self.conv2 = nn.Conv2d(6, 16, 5)
            self.fc1 = nn.Linear(256, 120)
            self.fc2 = nn.Linear(120, 84)
            self.fc3 = nn.Linear(84, 10)

        def forward(self, x):
            x = self.pool(F.relu(self.conv1(x))) 
            x = self.pool(F.relu(self.conv2(x)))
            x = torch.flatten(x, 1) 
            x = F.relu(self.fc1(x))
            x = F.relu(self.fc2(x))
            x = self.fc3(x)
            return x

    net = Net()

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(net.parameters(), lr=0.001, momentum=0.9)


    dataiter = iter(testloader)
    images, labels = dataiter.next()

    net = Net()

    net.load_state_dict(torch.load(".\\classification\\cifar_net_emotion.pth"))
    outputs = net(images)

    _, predicted = torch.max(outputs, 1)

    # print('Predicted: ', ' '.join('%5s' % classes[predicted[j]] for j in range(1)))

    result = ' '.join('%s' % classes[predicted[j]] for j in range(1))


    # return render(request, 'classification/resultoutput.html', context)
    json_object = { 'result': result }
    return JsonResponse(json_object)

@csrf_exempt
def emotionoutput(request):
    # print(request)
    str_request_body = str(request.body)
    str_request_body = str_request_body[:100]
    # print(str_request_body)
    # print(request.body)


    path = request.body
    # print(json.loads(request.body))
    # path = json.loads(request.body)['path']
    
    # path = request.headers['path']
    # print(path)

    height = saveimage_emotion(path)

    # 전처리
    try:
        # count = preprocessing_face_cascade_emotion(height)
        count = preprocessing_face_cascade_emotion()
        print("faces", count)
        # if count == 0:
        #     print("얼굴없음")
        # elif count == 1:
        #     print("얼굴 1")
        # else:
        #     print("얼굴많음")
        # print("전처리함")
        
    except:
        print("전처리실패")
        pass

    classes = ('anger', 'anxiety', 'joy', 'neutral', 'panic', 'sadness', 'wound')
    # print(classes)
    # 이미지분류
    DATA_PATH_TESTING_LIST = ['classification/preprocessed_emotion/anger/1.jpg']
    # print(DATA_PATH_TESTING_LIST)

    testloader = torch.utils.data.DataLoader(
        MyCifarSet(
            DATA_PATH_TESTING_LIST, 
            classes,
            transform=transform
        ),
        batch_size=4,
        shuffle = False
    )
    class Net(nn.Module):
        def __init__(self):
            super().__init__()
            self.conv1 = nn.Conv2d(3, 6, 5)
            self.pool = nn.MaxPool2d(2, 2)
            self.conv2 = nn.Conv2d(6, 16, 5)
            self.fc1 = nn.Linear(256, 120)
            self.fc2 = nn.Linear(120, 84)
            self.fc3 = nn.Linear(84, 10)

        def forward(self, x):
            x = self.pool(F.relu(self.conv1(x))) 
            x = self.pool(F.relu(self.conv2(x)))
            x = torch.flatten(x, 1) 
            x = F.relu(self.fc1(x))
            x = F.relu(self.fc2(x))
            x = self.fc3(x)
            return x

    net = Net()

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(net.parameters(), lr=0.001, momentum=0.9)


    dataiter = iter(testloader)
    images, labels = dataiter.next()

    net = Net()

    net.load_state_dict(torch.load("/home/ubuntu/S05P21C105/BE/ai-server/classification/cifar_net_emotion.pth"))
    outputs = net(images)

    _, predicted = torch.max(outputs, 1)

    # print('Predicted: ', ' '.join('%5s' % classes[predicted[j]] for j in range(1)))

    result = ' '.join('%s' % classes[predicted[j]] for j in range(1))
    if count == 0:
        result = "None"
    print(result)
    # return render(request, 'classification/resultoutput.html', context)
    json_object = { 'result': result }

    return JsonResponse(json_object)
