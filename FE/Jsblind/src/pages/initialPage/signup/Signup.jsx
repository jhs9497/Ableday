import React, { useState, useEffect } from "react";
import "common/pageCss/signup.css";
import "common/CSS/common.css";
import axios from "axios";
import Swal from "sweetalert2";
import history from "utils/history";

const SignUp = () => {
  useEffect(() => {
    if (localStorage.getItem("nickname") !== null) {
      history.push("/main");
    }
  }, []);

  const CheckId = (idInput) => {
    const regExp1 = /^[a-z|A-Z|0-9|]{5,10}$/;
    return regExp1.test(idInput);
  };
  const CheckPw = (pwInput) => {
    const regExp2 =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
    return regExp2.test(pwInput);
  };
  const CheckNn = (nnInput) => {
    const regExp3 = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{5,10}$/;
    return regExp3.test(nnInput);
  };
  const CheckBd = (bdInput) => {
    const regExp4 = /^[0-9]{8}$/;
    if (
      parseInt(bdInput.slice(0, 4)) <= 2002 &&
      parseInt(bdInput.slice(4, 6)) <= 12 &&
      parseInt(bdInput.slice(4, 6)) !== 0 &&
      parseInt(bdInput.slice(6, 8)) <= 31 &&
      parseInt(bdInput.slice(6, 8)) !== 0 &&
      regExp4.test(bdInput)
    ) {
      return true;
    } else {
      return false;
    }
  };
  const CheckGd = (gdInput) => {
    if (gdInput === "남자") {
      return "male";
    } else if (gdInput === "여자") {
      return "female";
    }
    return "error";
  };

  const [idExist, setIdExist] = useState(true);
  const ChekcIdExist = (e) => {
    e.preventDefault();
    axios({
      method: "get",
      url: "https://j5c105.p.ssafy.io/api-boot/user/check",
      headers: {
        "Content-Type": `application/json`,
      },
      params: {
        id: id,
      },
    })
      .then((res) => {
        const imgUrl = `Images/animals/squirtle.png`;
        Swal.fire({
          title: "좋아요!",
          text: "사용 가능한 아이디입니다😊",
          imageUrl: imgUrl,
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: "Custom image",
        });
        setIdExist(false);
      })
      .catch((error) => {
        if (error.response.data.status == "CONFLICT") {
          const imgUrl = `Images/animals/lion.png`;
          Swal.fire({
            title: "잠시만요!",
            text: "이미 존재하는 아이디입니다😥",
            imageUrl: imgUrl,
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: "Custom image",
          });
          setId("");
          setIdExist(true);
        }
      });
  };

  const [id, setId] = useState("");
  const FillId = (e) => {
    setIdExist(true);
    if (CheckId(e.target.value) === true) {
      setId(e.target.value);
    } else {
      setId("");
    }
  };

  const [pw, setPw] = useState("");
  const FillPw = (e) => {
    if (CheckPw(e.target.value) === true) {
      setPw(e.target.value);
    } else {
      setPw("");
    }
  };

  const [nn, setNn] = useState("");
  const FillNn = (e) => {
    if (CheckNn(e.target.value) === true) {
      setNn(e.target.value);
    } else {
      setNn("");
    }
  };

  const [bd, setBd] = useState("");
  const FillBd = (e) => {
    if (CheckBd(e.target.value) === true) {
      setBd(e.target.value);
    } else {
      setBd("");
    }
  };

  const [gd, setGd] = useState("");
  const FillGd = (e) => {
    if (CheckGd(e.target.value) !== "error") {
      setGd(CheckGd(e.target.value));
    } else {
      setGd("");
    }
  };

  const animalImageList = [
    "bear_m",
    "deer_w",
    "dinosaur_m",
    "dog_w",
    "squirtle_w",
    "squirtle",
  ];

  const SendSignupRequest = (e) => {
    e.preventDefault();
    axios({
      method: "post",
      url: "https://j5c105.p.ssafy.io/api-boot/user/signup",
      headers: {
        "Content-Type": `application/json`,
      },
      data: {
        id: id,
        password: pw,
        nickname: nn,
        gender: gd,
        birthday: bd,
      },
    })
      .then((res) => {
        const alertText = "반갑습니다 애블데이와 함께해볼까요😊";
        const animalrnd =
          animalImageList[Math.floor(Math.random() * animalImageList.length)];
        const imgUrl = `Images/animals/${animalrnd}.png`;
        Swal.fire({
          title: "가입 완료!",
          text: alertText,
          imageUrl: imgUrl,
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: "Custom image",
        });
        SendUserInfo();
      })
      .catch((error) => {
        const imgUrl = `Images/animals/lion.png`;
        Swal.fire({
          title: "잠시만요!",
          text: "가입할 수 없는 정보입니다😥",
          imageUrl: imgUrl,
          imageWidth: 200,
          imageHeight: 200,
          imageAlt: "Custom image",
        });
      });
  };

  const SendUserInfo = async () => {
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
        history.push("/imageupload");
      });
    } catch (e) {
      console.log(e);
    }
  };
  const onKeyDown = (keyEvent) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault();
    }
  };

  return (
    <div className="signup">
      <h1 className="signup-title">회원가입</h1>
      <div className="signup-header">
        <img src="Images/logo1.png" className="signup-logo" alt="logo1" />
        <div className="signup-balloon">
          <img
            src="Images/textballoon.png"
            alt="text-balloon"
            className="signup-balloon-image"
          />
          {gd !== "" ? (
            <div className="signup-balloon-text-web web-mode">
              감사합니다 :) <br />
              이제 곧 사진 등록 후 <br />
              동물상을 확인하러 갈 수 있어요!
            </div>
          ) : (
            <div className="signup-balloon-text-web web-mode">
              반갑습니다 :) <br />
              간단히 작성해주시면 <br />
              동물상을 확인하러 갈 수 있어요!
            </div>
          )}
          {gd !== "" ? (
            <div className="signup-balloon-text-mobile mobile-mode">
              감사합니다 :) <br />
              이제 곧 사진 등록 후 <br />
              동물상을 확인하러 갈 수 있어요!
            </div>
          ) : (
            <div className="signup-balloon-text-mobile mobile-mode">
              반갑습니다 :) <br />
              간단히 작성해주시면 <br />
              동물상을 확인하러 갈 수 있어요!
            </div>
          )}
        </div>
      </div>
      <form className="signup-form" onKeyDown={onKeyDown}>
        <p>
          제가 '애블데이'에서 사용할
          <p className="signup-typing-id">
            아이디는{" "}
            <input
              type="text"
              name="ID"
              placeholder="아이디"
              className="signup-input"
              onChange={FillId}
              autoFocus
            />{" "}
            ,{" "}
          </p>
          {id !== "" ? (
            <button onClick={ChekcIdExist} className="id-check-btn">
              🚦 아이디 중복체크
            </button>
          ) : null}
          {id !== "" && idExist == false ? (
            <div className="signup-typing-pw">
              비밀번호는{" "}
              <input
                type="text"
                name="PW"
                placeholder="비밀번호"
                className="signup-input"
                onChange={FillPw}
              />{" "}
              입니다.
            </div>
          ) : (
            <p className="signup-warning-id">
              아이디는 영문, 숫자만 가능하고 최소 5자리, 최대 10자리입니다.
            </p>
          )}
          {id !== "" && pw === "" && idExist == false ? (
            <p className="signup-warning-pw">
              비밀번호는 영문, 숫자, 특수문자를 각각 1회 이상 사용해야하고 최소
              8자리입니다.
            </p>
          ) : null}
          {pw !== "" ? (
            <p className="signup-typing-gender">
              성별은{" "}
              <input
                type="text"
                name="gd"
                placeholder="성별"
                className="signup-input"
                onChange={FillGd}
              />{" "}
              ,
            </p>
          ) : null}
          {pw !== "" && gd === "" ? (
            <p className="signup-warning-gd">
              성별은 한글만 가능합니다 (예시)남자{" "}
            </p>
          ) : null}
          {gd !== "" ? (
            <p className="signup-typing-bd">
              생년월일은{" "}
              <input
                type="text"
                name="bd"
                placeholder="생년월일"
                className="signup-input"
                onChange={FillBd}
                autoFocus
              />{" "}
              로
            </p>
          ) : null}
          {gd !== "" && bd === "" ? (
            <p className="signup-warning-bd">
              생년월일은 숫자만 사용하여 8자리로 적어주세요. 만 20세 이상만 가입
              가능합니다 (예시)19930112
            </p>
          ) : null}
          {bd !== "" ? (
            <p className="signup-typing-nn">
              닉네임은{" "}
              <input
                type="text"
                name="NN"
                placeholder="닉네임"
                className="signup-input"
                onChange={FillNn}
                autoFocus
              />{" "}
              을 사용할 예정입니다.
            </p>
          ) : null}
          {bd !== "" && nn === "" ? (
            <p className="signup-warning-nn">
              닉네임은 한글, 영문, 숫자만 가능하고 최소 5자리, 최대
              10자리입니다.
            </p>
          ) : null}
        </p>

        <div className="signup-submit">
          <br />
          <p className="signup-submit-comment">사진 등록하러 가기 ▶▶</p>
          {id !== "" && pw !== "" && nn !== "" && bd !== "" && gd !== "" ? (
            <button
              type="submit"
              className="signup-submit-btn"
              disabled={false}
              onClick={SendSignupRequest}
            >
              GO!
            </button>
          ) : (
            <button
              type="submit"
              className="signup-submit-btn"
              disabled={true}
              onClick={SendSignupRequest}
            >
              GO!
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SignUp;
