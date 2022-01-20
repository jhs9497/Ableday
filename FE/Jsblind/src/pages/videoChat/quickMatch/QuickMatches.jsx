import React, { useState, useEffect } from "react";
import "common/pageCss/quickMatch.css";
import "common/pageCss/review.css";
import { useDispatch, useSelector } from "react-redux";
// import { BgCloudy } from '../../../common/redux/actions/bgCloudyAction';
import { BsFillStarFill } from "react-icons/bs";
import { BiCaretRightSquare } from "react-icons/bi";
import { BiRightArrowAlt } from "react-icons/bi";
import history from "utils/history";
import { BgCloudy } from "redux/actions/bgCloudyAction";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation } from "react-router";
import { cancel } from "@redux-saga/core/effects";

const QuickMatch = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.reviewReducer);
  let timer;
  let askTimer;
  const pairInfo = location.state.pairInfo;
  const genderDic = {
    male: "m",
    female: "w",
  };

  const score =
    (pairInfo.manner +
      pairInfo.likeability +
      pairInfo.animal_accuracy +
      pairInfo.humor) /
    4;

  const [starRating, setStarRating] = useState(5);

  useEffect(() => {
    dispatch(BgCloudy(false));

    return () => {
      dispatch(BgCloudy(true));
    };
  }, []);

  const goVideoChat = async () => {
    const accessToken = localStorage.getItem("token");
    await axios({
      method: "post",
      url: "https://j5c105.p.ssafy.io/api-boot/service/match/decide/true",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => {
      Swal.fire({
        title: "잠시만 기다려주세요",
        html: "상대방 수락을 기다리는 중입니다",
        timer: 100000,
        timerProgressBar: true,
        allowOutsideClick: false,
        showConfirmButton: false,
        showDenyButton: true,
        denyButtonText: "취소",
        didOpen: () => {
          AskStartOrStop();
        },
      }).then((res) => {
        if (res.isDenied) {
          console.log("취소?");
          axios({
            method: "post",
            url: "https://j5c105.p.ssafy.io/api-boot/service/match/decide/cancel",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          AskStartOrStop();
        }
      });
    });
  };

  const AskDecide = async () => {
    const accessToken = localStorage.getItem("token");
    await axios({
      method: "post",
      url: "https://j5c105.p.ssafy.io/api-boot/service/match/askdecide",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.data.message == "SUCCESS") {
          const r = JSON.stringify(res.data.data.id);
          const roomName = r.substring(1, 10);
          AskStartOrStop();
          Swal.close();
          history.push({
            pathname: "/video/videochat",
            state: {
              roomName: roomName,
              pairInfo: pairInfo,
            },
          });
        }
      })
      .catch((error) =>
        axios({
          method: "post",
          url: "https://j5c105.p.ssafy.io/api-boot/service/match/stop",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }).then(() => {
          AskStartOrStop();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "상대방이 거절했습니다..",
          }).then((result) => {
            if (result.isConfirmed) {
              history.push({
                pathname: "/main",
              });
            }
          });
        })
      );
  };

  const AskStartOrStop = () => {
    if (!askTimer) {
      const t = setInterval(() => AskDecide(), 1000);
      askTimer = t;
    } else {
      clearInterval(askTimer);
      askTimer = undefined;
    }
  };

  const SearchNextUser = () => {
    const accessToken = localStorage.getItem("token");
    Swal.fire({
      text: "다른 유저를 추천받으시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "네, 다른 분이요!",
      cancelButtonText: "아니요!",
    }).then((result) => {
      if (result.isConfirmed) {
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
            axios({
              method: "post",
              url: "https://j5c105.p.ssafy.io/api-boot/service/match/stop",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }).then(() => {
              console.log("스탑 성공");
              axios({
                method: "post",
                url: "https://j5c105.p.ssafy.io/api-boot/service/match/decide/false",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }).then(() => {
                console.log("false성공");
              });
            });

            SendMatchRequest();
          },
        }).then((result) => {
          if (result.isDenied) {
            console.log("ㅇㅇ?");
            axios({
              method: "post",
              url: "https://j5c105.p.ssafy.io/api-boot/service/match/stop",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }).then(() => {
              console.log("스탑 성공");
              axios({
                method: "post",
                url: "https://j5c105.p.ssafy.io/api-boot/service/match/decide/false",
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }).then(() => {
                console.log("false성공");
              });
            });

            history.push("/main");
          }

          StartOrStop();
        });
      }
    });
  };

  const ReturnToHome = () => {
    Swal.fire({
      text: "다른 동물상을 추천받으시겠습니까?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "네, 다시 선택할래요!",
      cancelButtonText: "아니요!",
    }).then((result) => {
      if (result.isConfirmed) {
        const accessToken = localStorage.getItem("token");
        if (!askTimer) {
          askTimer = true;
        }
        AskStartOrStop();
        axios({
          method: "post",
          url: "https://j5c105.p.ssafy.io/api-boot/service/match/stop",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }).then(() => {
          console.log("스탑 성공");
          axios({
            method: "post",
            url: "https://j5c105.p.ssafy.io/api-boot/service/match/decide/false",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }).then(() => {
            console.log("false성공");
          });
        });

        history.push("/main");
      }
    });
  };

  const SendMatchRequest = async () => {
    const accessToken = localStorage.getItem("token");
    await axios({
      method: "post",
      url: "https://j5c105.p.ssafy.io/api-boot/service/match/start",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        animals: location.state.animalList,
      },
    }).then((res) => {
      if (res.data.message == "Matching Start") {
        StartOrStop();
      } else if (res.data.message == "Matching Success") {
        Swal.close();
        history.push({
          pathname: "/video/quick",
          state: {
            animals: location.state.animalList,
            pairInfo: pairInfo,
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
            animals: location.state.animalList,
            pairInfo: pairInfo,
          },
        });
      }
    });
  };

  return (
    <>
      <div className="quick-container">
        <img
          className="quick-container-bg"
          src={process.env.PUBLIC_URL + "/Images/quick6.jpg"}
          alt=""
        />
        <div className="quick-info">
          <img
            className="quick-container-profile"
            src={
              process.env.PUBLIC_URL +
              `/Images/animals/${pairInfo.animal}_${
                genderDic[pairInfo.gender]
              }.png`
            }
            alt="No image"
          ></img>
          <div className="quick-user-info">
            <h2>{pairInfo.nickname}</h2>
            <div className="quick-user-keyword-first">
              {pairInfo.keyword1 !== null ? (
                <h5>#{pairInfo.keyword1}</h5>
              ) : null}
              {pairInfo.keyword2 !== null ? (
                <h5>#{pairInfo.keyword2}</h5>
              ) : null}
              {pairInfo.keyword3 !== null ? (
                <h5>#{pairInfo.keyword3}</h5>
              ) : null}
            </div>
            <div className="quick-user-keyword-second">
              {pairInfo.keyword4 !== null ? (
                <h5>#{pairInfo.keyword4} </h5>
              ) : null}
              {pairInfo.keyword5 !== null ? (
                <h5>#{pairInfo.keyword5}</h5>
              ) : null}
            </div>
            <div className="score-zone">
              <h3>타 유저들의 HINT</h3>

              <div className="score-zone-total">
                <BsFillStarFill className="review-star" /> {score}
              </div>

              <div className="score-zone-first">
                🤗매너:{pairInfo.manner}
                <div style={{ width: "20px" }}></div> 😎호감도:
                {pairInfo.likeability}
              </div>
              <div className="score-zone-second">
                🐰동물상유사도:{pairInfo.animal_accuracy}
                <div style={{ width: "20px" }}></div> 🤭유머:
                {pairInfo.humor}
              </div>
            </div>
          </div>

          <button className="btn-rounded quick-btn" onClick={goVideoChat}>
            <BiCaretRightSquare />
            Start
          </button>
          <button className="btn-util quick-back-btn" onClick={ReturnToHome}>
            Home
          </button>
          <button className="btn-util quick-next-btn" onClick={SearchNextUser}>
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default QuickMatch;
