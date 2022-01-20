import cv2
# import cvlib as cv

def preprocessing_face_cascade(gender):
    # 이미지 경로 조합
    input_file_dir = "./classification/data/" + gender + "/inputimage.jpg"
    output_file_dir = "./classification/preprocessed/" + gender + "/dog/"

    # 이미지를 읽는다.
    # img_array = np.fromfile(input_file_dir, np.uint8)
    # img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    src = cv2.imread(input_file_dir)

    # # 이미지가 잘 읽어지는지 확인한다.
    # cv2.imshow('image', src)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    # 이미지를 grayscale로 전환한다.
    # gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    src_gray = src

    # 이미지가 잘 바뀌었는지 확인한다.
    # cv2.imshow('gray', src_gray)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()

    # opencv으 CascadeClassifier를 불러온다.
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # https://pythonq.com/so/c%2B%2B/74269  
    # gray에서 얼굴을 찾는다.
    # scaleFactor=1.1, 얼굴을 10% 줄여서
    # minNeighbors=4, 최소 객체 크기 
    # faces = face_cascade.detectMultiScale(gray, 1.05, 4)
    # 6으로 수정
    faces = face_cascade.detectMultiScale(src_gray, 1.05, 30)
    # print("face")
    # gray를 기준으로 faces를 순회하면서 얼굴을 crop한다.
    # 사각형 그리기는 rectangle사용, (x, y)는 좌상단 좌표, (x+w, y+h)는 우하단 좌표
    # (0, 0, 255)는 테두리선의 color값 
    # 테두리선 값이 -1이면 채워진 사각형, 양수면 비워진 사각형
    count = 0
    # print(0)
    # time.sleep(3)
    for (x,y,w,h) in faces:
        count += 1
        # print(count)
        cv2.rectangle(src, (x,y), (x+w, y+h), (255,0,0),2)
        roi_gray = src_gray[y:y+h, x:x+w]
        # face_crop = np.copy(roi_gray[x:y, w:h])
        # (label, confidence) = cv.detect_gender(face_crop)
        # print(label, confidence)

        # # 얼굴이 잘 잘렸는지 확인한다.
        # cv2.imshow("face",roi_gray)
        # cv2.waitKey(1000)
        # cv2.destroyAllWindows()

        # 리사이즈한다.
        dst = cv2.resize(roi_gray, dsize=(30, 30), interpolation=cv2.INTER_AREA)

        # 저장한다.
        cv2.imwrite(output_file_dir + str(count) + ".jpg", dst)
    return count


# 변환할 이미지들을 가지고 있는 폴더의 경로를 가져와 전처리한다.

# gender_list =  os.listdir("..\\Data_collection\\downloads")
# # print(gender_list)
# for gender in gender_list:
#     animal_list = os.listdir("..\\Data_collection\\downloads\\" + gender)
#     # print(animal_list)
#     for animal in animal_list:
#         file_list = os.listdir("..\\Data_collection\\downloads\\" + gender + "\\" + animal)
#         # print("사진리스트:", file_list)
#         for file in file_list:
#             try:
#                 print(gender, animal, file)
#                 preprocessing_face_cascade(gender, animal, file)
#             except:
#                 print(gender, animal, file)
#                 print("얼굴없음")



# preprocessing_face_cascade("../Data_collection/downloads/female/강아지/구혜선/4.9973e53b5fa56f1f15.jpg")

# img_path = "..\Data_collection\downloads\\female\\강아지\\test.jpg"
# img_array = np.fromfile(img_path, np.uint8)
# img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
# # 이미지가 잘 읽어지는지 확인한다.
# cv2.imshow('image', img)
# cv2.waitKey(0)
# cv2.destroyAllWindows()


 
# # path = 'D:/티스토리/티스토리 포스팅/python/cv2.imread 한글 파일 경로 인식 실패 문제 해결 방법'
# full_path = "..\\Data_collection\downloads\\female\강아지\\test.jpg"

# # 한글 경로가 포함되어 cv2.imread로 읽지 않고, 데이터를 넘파이 행렬로 읽은 다음, cv2.imdecode 함수로 복호화해 읽는다.
# img_array = np.fromfile(full_path, np.uint8)
# img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
 
# cv2.imshow('test', img)
# cv2.waitKey(0)
# cv2.destroyAllWindows()
# gender = "female"

# preprocessing_face_cascade(gender)