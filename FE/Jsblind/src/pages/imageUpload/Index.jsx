import React, { useState, useEffect } from "react";
import "common/pageCss/imageUpload.css";
import PetsIcon from "@mui/icons-material/Pets";
import axios from "axios";
import Swal from "sweetalert2";
import history from "utils/history";

function ImageUpload() {
  const nickname = localStorage.getItem("nickname");
  useEffect(() => {
    if (localStorage.getItem("nickname") == null) {
      history.push("/");
    }
  }, []);

  const animalImageList = [
    "bear_m",
    "deer_w",
    "dinosaur_m",
    "dog_w",
    "squirtle_w",
    "squirtle",
  ];

  const animalrnd =
    animalImageList[Math.floor(Math.random() * animalImageList.length)];
  const defaultImgUrl = `Images/animals/${animalrnd}.png`;
  const [imgBase64, setImgBase64] = useState(defaultImgUrl);
  const [imgFile, setImgFile] = useState(defaultImgUrl);
  const [disabled, setDisabled] = useState(true);

  const UploadFile = (e) => {
    if (
      e.target.value.match(/\.([^\.]+)$/)[1] == "jpg" ||
      e.target.value.match(/\.([^\.]+)$/)[1] == "png" ||
      e.target.value.match(/\.([^\.]+)$/)[1] == "JPG" ||
      e.target.value.match(/\.([^\.]+)$/)[1] == "PNG" ||
      e.target.value.match(/\.([^\.]+)$/)[1] == "jpeg" ||
      e.target.value.match(/\.([^\.]+)$/)[1] == "JPEG"
    ) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        if (base64) {
          setImgBase64(base64.toString());
        }
      };
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0]);
        setImgFile(e.target.files[0]);
        setDisabled(false);
      }
    } else {
      const imgUrl = `Images/animals/lion.png`;
      Swal.fire({
        title: "잠시만요!",
        text: "파일 형식을 다시 한번 확인해주세요😥",
        imageUrl: imgUrl,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Custom image",
      });
      setDisabled(true);
      setImgBase64(defaultImgUrl);
      setImgFile(defaultImgUrl);
    }
  };

  const SendFile = async (e) => {
    e.preventDefault();
    const accessToken = localStorage.getItem("token");
    const fd = new FormData();
    fd.append("file", imgFile);
    await axios({
      method: "post",
      url: "https://j5c105.p.ssafy.io/api-boot/profile/image",
      headers: {
        "Content-Type": `multipart/form-data`,
        Authorization: `Bearer ${accessToken}`,
      },
      data: fd,
    })
      .then((res) => {
        const nickname = localStorage.getItem("nickname");
        const alertText = `${nickname}님 동물상을 확인해볼까요😊`;
        const animalrnd =
          animalImageList[Math.floor(Math.random() * animalImageList.length)];
        const imgUrl = `Images/animals/${animalrnd}.png`;
        Swal.fire({
          title: "사진 등록 완료!",
          text: alertText,
          imageUrl: imgUrl,
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: "Custom image",
        });

        // history.go(0);
      })
      .catch((error) => {
        const imgUrl = `Images/animals/lion.png`;
        Swal.fire({
          title: "잠시만요!",
          text: "다시 한번 확인해주세요😥",
          imageUrl: imgUrl,
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: "Custom image",
        });
      });
    setTimeout(() => {
      history.push("/user/mypage");
      history.go(0);
    }, 1000);
  };
  return (
    <div>
      <div className="image-upload-title">
        사진 등록하기 <PetsIcon fontSize="large" />
      </div>
      <form className="image-upload-form">
        <p className="image-info">
          마이페이지에 등록되는 이 사진은 전체공개가 아니며
          <br />
          영상채팅 후 서로 친구추가시에만 볼 수 있게돼요!
          <br />
          (jpg, jpeg, png 형식의 파일만 업로드 가능합니다)
        </p>
        <div className="file-upload">
          <img className="file-image" src={imgBase64} />
          <label className="btn-sm file-btn" htmlFor="imgFile">
            파일선택
          </label>
          <input
            type="file"
            className="file-select"
            name="imgFile"
            id="imgFile"
            accept=".jpg, .png, .jpeg"
            onChange={UploadFile}
          />
        </div>
        <div className="image-submit">
          <p>동물상 확인하러 가기</p>
          <button
            type="submit"
            className="signup-submit-btn"
            disabled={disabled}
            onClick={SendFile}
          >
            GO!
          </button>
        </div>
      </form>
    </div>
  );
}

export default ImageUpload;
