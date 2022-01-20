import React from "react";

import onlineIcon from "pages/userpage/chatting/icons/onlineIcon.png";
import closeIcon from "pages/userpage/chatting/icons/closeIcon.png";

import "./InfoBar.css";

const InfoBar = ({ room }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <img className="onlineIcon" src={onlineIcon} alt="online icon" />
      <h3>애블데이 채팅</h3>
    </div>
    <div className="rightInnerContainer">
      <a href="/user/mypage">
        <h3>나가기</h3>
      </a>
    </div>
  </div>
);

export default InfoBar;
