import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import history from "utils/history";
import Swal from "sweetalert2";

function QuickMatch(props) {
  const animalInfo = {
    dog: [
      "강아지상",
      "눈코입이 동글동글한 얼굴형으로 귀엽고 사랑스러운 느낌을 많이 주는 순한 이미지의 얼굴",
    ],
    bear: ["곰상", "귀여우면서도 우직한 분위기, 듬직하고 푸근한 매력"],
    dinosaur: [
      "공룡상",
      "큼직한 이목구비, 부드러운 눈매와 입매, 남자다우면서 부드러운 인상이 매력",
    ],
    wolf: ["늑대상", "얼굴이 각지고 눈매가 올라가서 날카로운 눈빛이 매력"],
    rabbit: [
      "토끼상",
      "하얀 피부, 앞니나 인중이 뚜렷한 특징, 동그랗고 커다란 눈망울이 매력",
    ],
    cat: [
      "고양이상",
      "눈이 큰편, 눈꼬리가 올라가 있으며 차가우면서 신비하고 세련된 분위기가 매력",
    ],
    deer: ["사슴상", "눈망울이 선하고 선이 고운 비주얼이 매력"],
    squirtle: [
      "꼬부기상",
      "눈과 입이 크고 이마가 넓고 웃을 때 선하고 귀여운 인상이 매력",
    ],
    horse: [
      "말상",
      "얼굴과 코가 긴편,  뚜렷하고 시원한 이목구비와 강한 턱(하관)이 매력",
    ],
    fox: [
      "여우상",
      "눈매가 길쭉하며 눈꼬리가 올라가고 갸름한 얼굴형, 날렵한 코끝이나 턱선이 매력",
    ],
  };

  const animalGroup = props.animal;
  let timer;

  const SendAnimal = () => {
    Swal.fire({
      title: "잠시만 기다려주세요",
      html: "매칭중입니다",
      timer: 100000,
      showConfirmButton: false,
      timerProgressBar: true,
      allowOutsideClick: false,
      showDenyButton: true,
      denyButtonText: "매칭 취소하기",
      didOpen: () => {
        SendMatchRequest();
      },
    }).then((result) => {
      if (result.isDenied) {
        const accessToken = localStorage.getItem("token");
        StartOrStop();
        axios({
          method: "post",
          url: "https://j5c105.p.ssafy.io/api-boot/service/match/stop",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }).then(() => {
          console.log("스탑 성공");
        });
        history.push("/main");
      }
    });
  };

  const SendMatchRequest = async () => {
    console.log("matchrequest중", props.animalList);
    const accessToken = localStorage.getItem("token");
    await axios({
      method: "post",
      url: "https://j5c105.p.ssafy.io/api-boot/service/match/start",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        animals: props.animalList,
      },
    }).then((res) => {
      if (res.data.message == "Matching Start") {
        StartOrStop();
      } else if (res.data.message == "Matching Success") {
        Swal.close();
        history.push({
          pathname: "/video/quick",
          state: {
            animalList: props.animalList,
            pairInfo: res.data.data,
          },
        });
      }
    });
  };

  const StartOrStop = () => {
    if (!timer) {
      const t = setInterval(() => CheckMatchingSuccess(), 1000);
      timer = t;
    } else {
      clearInterval(timer);
      timer = undefined;
    }
  };

  const CheckMatchingSuccess = async () => {
    const accessToken = localStorage.getItem("token");
    await axios({
      method: "post",
      url: "https://j5c105.p.ssafy.io/api-boot/service/match/ask",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => {
      if (res.data.message == "Matching SUCCESS") {
        StartOrStop();
        Swal.close();
        history.push({
          pathname: "/video/quick",
          state: {
            animalList: props.animalList,
            pairInfo: res.data.data,
          },
        });
      }
    });
  };

  const Animals =
    props.animalList &&
    props.animalList.map((animal) => (
      <p className="animal-name">💜 {animalInfo[animal][0]}</p>
    ));

  return (
    <>
      <div className="quick-match-zone">
        <div action="" className="quick-match-form">
          <button
            type="submit"
            className="quick-match-btn"
            onClick={SendAnimal}
            disabled={props.animalList.length == 0}
          >
            Start!
          </button>
        </div>
        <div className="animal-detail">
          <img
            src="Images/ellipse.png"
            className="quick-match-ellipse web-mode"
            alt="logo"
          />
          <img
            src="Images/circle.png"
            className="quick-match-ellipse mobile-mode"
            alt="logo"
          />
          <div className="text-on-ellipse">
            {props.animal ? (
              <div>
                <p className="animal-list-web web-mode">{Animals}</p>
                <p className="animal-name-web web-mode">
                  {animalInfo[animalGroup][0]}
                </p>
              </div>
            ) : (
              <p>
                <br />
              </p>
            )}
            <br />
            {props.animal ? (
              <p className="animal-description-web web-mode">
                {animalInfo[animalGroup][1]}
              </p>
            ) : (
              <p className="animal-blank-web web-mode">
                원하는 동물상을 선택한 후<br />
                Start를 눌러 퀵매치를 진행해주세요
              </p>
            )}
          </div>
          <div className="text-on-ellipse">
            {props.animal ? (
              <div>
                <p className="animal-list-mobile mobile-mode">{Animals}</p>
                <p className="animal-name-mobile mobile-mode">
                  {animalInfo[animalGroup][0]}
                </p>
              </div>
            ) : (
              <p>
                <br />
              </p>
            )}
            {props.animal ? (
              <p className="animal-description-mobile mobile-mode">
                {animalInfo[animalGroup][1]}
              </p>
            ) : (
              <p className="animal-blank-mobile mobile-mode">
                원하는 동물상을 선택한 후<br />
                Start를 눌러 퀵매치를 진행해주세요
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default QuickMatch;
