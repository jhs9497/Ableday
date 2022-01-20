import React, { useState, useEffect } from "react";
import LoginCarousel from "pages/initialPage/login/LoginCarousel";
import "common/pageCss/login.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import history from "utils/history";

const Login = () => {
  useEffect(() => {
    if (localStorage.getItem("nickname") !== null) {
      history.push("/main");
    }
  }, []);

  const dispatch = useDispatch();
  const [id, setId] = useState("");
  const FillId = (e) => {
    setId(e.target.value);
  };

  const [pw, setPw] = useState("");
  const FillPw = (e) => {
    setPw(e.target.value);
  };
  const animalImageList = [
    "bear_m",
    "deer_w",
    "dinosaur_m",
    "dog_w",
    "squirtle_w",
    "squirtle",
  ];
  const SendUserInfo = async (e) => {
    e.preventDefault();
    try {
      await axios({
        method: "post",
        url: "https://j5c105.p.ssafy.io/api-boot/user/signin",
        headers: {
          "Content-Type": `application/json`,
        },
        data: {
          id: id,
          password: pw,
        },
      }).then((res) => {
        const accessToken = res.data.data[1];
        localStorage.setItem("token", accessToken);
        const userNickname = res.data.data[0];
        localStorage.setItem("nickname", userNickname);

        const nickname = localStorage.getItem("nickname");
        const alertText = `${nickname}님 안녕하세요!`;
        const animalrnd =
          animalImageList[Math.floor(Math.random() * animalImageList.length)];
        const imgUrl = `Images/animals/${animalrnd}.png`;
        console.log(imgUrl);
        Swal.fire({
          title: "Welcome!",
          text: alertText,
          imageUrl: imgUrl,
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: "Custom image",
        });
        history.push("/main");
      });
    } catch (e) {
      const imgUrl = `Images/animals/lion.png`;
      console.log(e);
      Swal.fire({
        title: "잠시만요!",
        text: "존재하지 않는 정보입니다😥",
        imageUrl: imgUrl,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Custom image",
      });
    }
  };

  return (
    <div className="login-home">
      <div className="login-title">애블데이에 오신 걸 환영합니다</div>
      <div className="login-carousel">
        <LoginCarousel />
      </div>
      <form className="login-form" onSubmit={SendUserInfo}>
        <input
          type="text"
          name="ID"
          placeholder="ID"
          className="login-input"
          onChange={FillId}
        />
        <input
          type="password"
          name="PW"
          placeholder="PW"
          className="login-input"
          onChange={FillPw}
        />
        <button
          type="submit"
          id="login-btn"
          className="btn-sm"
          onClick={SendUserInfo}
        >
          로그인
        </button>
      </form>
      <div className="to-signup">
        <h4>계정이 없으신가요?</h4>
        <Link to="/signup" className="signup-link">
          회원가입 하기
        </Link>
      </div>
    </div>
  );
};

export default Login;
