import React, { useEffect, useState } from "react";
import VideoChat from "./VideoChat";
import { useDispatch } from "react-redux";
import { BgCloudy } from "../../../redux/actions/bgCloudyAction";
import "../../../common/pageCss/videoChat.css";
import { useLocation } from "react-router-dom";

import "./Index.css";

const VideoChatPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const nickname = localStorage.getItem("nickname");
  console.log("여기서 뽑아봐야 겠따", location.state);
  // console.log(location.state);
  // console.log("type", typeof location.state);
  // const roomname = JSON.stringfy(location.state.roomname);
  // console.log("여기부터 video");
  // console.log("video type", roomname);
  // console.log("room", roomname);

  useEffect(() => {
    dispatch(BgCloudy(false));
    return () => {
      dispatch(BgCloudy(true));
    };
  }, []);

  return (
    <>
      <VideoChat roomdata={location.state} nickname={nickname} />
    </>
  );
};

export default VideoChatPage;
