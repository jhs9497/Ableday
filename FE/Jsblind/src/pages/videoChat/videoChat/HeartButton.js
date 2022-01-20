import React, { useState, useEffect } from "react";
import Heart from "react-animated-heart";
import "./Index.css"

export default function HeartButton(props) {
  // useEffect(() => {
  //   // if(props.smile === 'joy') {
  //   //   clickBtn();
  //   console.log(props.expression, "여긴 버튼");
  //   console.log(props.trigger, "여긴배고파");
  // }, [props.trigger]);
  const [isClick, setClick] = useState(false);
  const clickBtn = async () => {
    await setClick(true);
    props.onClick();
    setTimeout(function () {
      props.onClick();
    }, 1000);
    setTimeout(function () {
      props.onClick();
    }, 2000);
    setTimeout(function () {
      props.onClick();
    }, 3000);
    setTimeout(function () {
      props.onClick();
    }, 4000);
    setTimeout(function () {
      reClick();
    }, 7000);
  };

  const reClick = () => {
    setClick(false)
    console.log("하이");
    
  }
  return (
    <div
      className="App videoChat-heartBtn"
      style={{ zIndex: "900" }}
    >
      <Heart isClick={isClick} onClick={clickBtn} />
    </div>
  );
}
