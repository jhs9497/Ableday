import React, { useEffect, useState, useRef } from "react";
import "./Index.css";
import html2canvas from "html2canvas";
import axios from "axios";
import ReactDOM, { unmountComponentAtNode } from "react-dom";
import Heart2 from "react-animated-heart";
import { FaRegLaugh } from "react-icons/fa";
import Swal from "sweetalert2";

const OpenViduVideoComponent = (props) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [timer, setTimer] = React.useState(undefined);

  const [smile, setSmile] = useState(undefined);
  const [myInfo, setMyInfo] = useState({
    animal: undefined,
    gender: undefined,
  });

  const [pairInfo, setPairInfo] = useState({
    animal: undefined,
    gender: undefined,
  });
  // const [expression, setExpression] = useState("gkdl");
  // const [trigger, setTrigger] = useState(false);

  const detect = () => {
    if (videoRef && canvasRef.current) {
      let ctx = canvasRef.current.getContext("2d");
      if (ctx && ctx !== null) {
        ctx.drawImage(videoRef.current, 0, 0, 400, 400);
      }
    }
  };

  const recursion = () => {
    setInterval(() => {
      detect();
    }, 10);
  };

  const handleOpenSmile = () => {
    setSmile(false);
    startOrStop();
  };

  const handleCloseSmile = () => {
    Swal.fire({
      title: "상대방을 웃게 만들 자신 있나요 ?",
      text: "상대방이 웃으면 하트가 생깁니다!",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Try!",
    }).then((result) => {
      if (result.isConfirmed) {
        setSmile(true);
        startOrStop();
      }
    });
  };

  const detectsmile = () => {
    html2canvas(document.getElementById("yourCanvas")).then((canvas) => {
      onSaveAs(canvas.toDataURL("image/jpg"), "image-download.jpg");
    });
  };

  const onSaveAs = (myImg, filename) => {
    var link = document.createElement("a");
    document.body.appendChild(link);
    const data = myImg.replace("data:image/png;base64,", "");
    sendToAI(data);
  };

  const sendToAI = async (data) => {
    const url = "https://j5c105.p.ssafy.io/classification/emotionoutput";
    const response = await axios
      .post(url, data)
      .then((response) => {
        console.log(response.data.result);
        if (response.data.result === "joy") {
          clickBtn();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const startOrStop = () => {
    if (!timer) {
      const t = setInterval(() => detectsmile(), 1000);
      setTimer(t);
    } else {
      clearInterval(timer);
      setTimer(undefined);
    }
  };

  const onClick = () => {
    const dom = document.createElement("div");
    document.getElementById("heart-generator").appendChild(dom);
    return ReactDOM.render(<Heart node={dom} />, dom);
  };

  const [isClick, setClick] = useState(false);
  const clickBtn = async () => {
    await setClick(true);
    onClick();
    setTimeout(function () {
      onClick();
    }, 1000);
    setTimeout(function () {
      onClick();
    }, 2000);
    setTimeout(function () {
      onClick();
    }, 3000);
    setTimeout(function () {
      onClick();
    }, 4000);
    setTimeout(function () {
      reClick();
    }, 7000);
  };

  const reClick = () => {
    setClick(false);
    console.log("하이");
  };

  const setPair = () => {
    let gender;
    if (props.pairInfo.gender === "male") {
      gender = "m";
    } else {
      gender = "w";
    }
    setPairInfo({
      ...pairInfo,
      animal: props.pairInfo.animal,
      gender: gender,
    });
  };

  useEffect(() => {
    if (props && !!videoRef) {
      props.streamManager.addVideoElement(videoRef.current);
      recursion();
      const token = localStorage.getItem("token");
      const getMyInfo = async () => {
        const res = await axios({
          method: "get",
          url: "https://j5c105.p.ssafy.io/api-boot/profile/mypage",
          headers: {
            "Content-Type": `application/json`,
            Authorization: `Bearer ${token}`,
          },
        })
          .then((res) => {
            let gender = false;
            if (res.data.data.gender === "male") {
              gender = "m";
            } else {
              gender = "w";
            }
            setMyInfo({
              ...myInfo,
              animal: res.data.data.animal,
              gender: gender,
            });
          })
          .catch((err) => {
            console.log(res);
          });
      };
      getMyInfo();
      setPair();
    }
  }, [props]);

  if (props.myNickname === props.sessionNickname) {
    return (
      <>
        <video autoPlay={true} ref={videoRef} />
        <p>{props.sessionNickname}</p>
        {props.myAnimal ? (
          <img
            src={
              process.env.PUBLIC_URL +
              `/Images/animals/${myInfo.animal}_${myInfo.gender}.png`
            }
            alt="No image"
          ></img>
        ) : null}
        <canvas width="400" height="400" ref={canvasRef}></canvas>

        <div></div>
      </>
    );
  } else {
    return (
      <>
        <video autoPlay={true} ref={videoRef} />

        <p>{props.sessionNickname}</p>
        {props.yourAnimal ? (
          <img
            src={
              process.env.PUBLIC_URL +
              `/Images/animals/${pairInfo.animal}_${pairInfo.gender}.png`
            }
            alt="No image"
          ></img>
        ) : null}
        <canvas
          id="yourCanvas"
          width="400"
          height="400"
          ref={canvasRef}
        ></canvas>

        <div
          className="videoChat-btnList"
          style={{ marginTop: "15px", height: "30px" }}
        >
          <div id="heart-generator">
            <div className="App videoChat-heartBtn" style={{ zIndex: "900" }}>
              <Heart2 isClick={isClick} onClick={clickBtn} />
            </div>
          </div>
          {smile ? (
            <button
              className="btn-util videoChat-btn-util"
              style={{ backgroundColor: "pink" }}
              onClick={handleOpenSmile}
            >
              ON
              <FaRegLaugh />
            </button>
          ) : (
            <button
              className="btn-util videoChat-btn-util"
              style={{ backgroundColor: "pink" }}
              onClick={handleCloseSmile}
            >
              OFF
              <FaRegLaugh />
            </button>
          )}
        </div>
      </>
    );
  }
};

const Heart = ({ node }) => {
  const range = 50;
  const left_origin = 10;
  const angularSpeed = 0.05;
  const riseSpeed = 4;
  const [left, setLeft] = useState(left_origin + Math.sin(0) * range);
  const [bottom, setBottom] = useState(0);
  const [theta, setTheta] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      unmountComponentAtNode(node);
    }, 5000);
  }, []);

  useEffect(() => {
    const token = setInterval(() => {
      setTheta(theta + angularSpeed);
      setBottom(bottom + riseSpeed);
      // x_intitial + Math.sin(45) * 50;
      setLeft(left_origin + Math.sin(theta) * range);
    }, 20);

    return () => {
      clearInterval(token);
    };
  }, [left, setLeft, bottom, setBottom, theta, setTheta]);

  return <div className="heart" style={{ bottom, left }} />;
};

export default OpenViduVideoComponent;
