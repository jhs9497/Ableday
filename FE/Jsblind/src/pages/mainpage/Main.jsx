import React, { useState, useEffect } from "react";
import "common/pageCss/mainpage.css";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import history from "utils/history";
import ForMale from "pages/mainpage/ForMale";
import ForFemale from "pages/mainpage/ForFemale";
import axios from "axios";

const MainPage = () => {
  const [userGender, setUserGender] = useState("");
  const nickname = localStorage.getItem("nickname");
  const accessToken = localStorage.getItem("token");
  useEffect(() => {
    if (localStorage.getItem("nickname") == null) {
      history.push("/");
    }

    axios({
      method: "get",
      url: "https://j5c105.p.ssafy.io/api-boot/profile/mypage",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => {
      setUserGender(res.data.data.gender);
    });
  }, []);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid var(--purple)",
    boxShadow: 24,
    p: 4,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className="main-page">
      <div className="main-page-header">
        <a href="/user/mypage">
          <button className="btn-sm to-mypage-btn-web web-mode">
            <AccountBoxIcon /> {nickname} <br /> 마이페이지
          </button>
          <button className="btn-sm to-mypage-btn-mobile mobile-mode">
            <AccountBoxIcon /> {nickname} <br /> 마이페이지
          </button>
        </a>
      </div>
      <p className="group-info-title">동물상 선택</p>
      <div className="group-select-tip">
        <Button onClick={handleOpen} color="secondary">
          Tip🔍
        </Button>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography
                id="transition-modal-description"
                className="group-select-tip"
                sx={{ mt: 0 }}
              >
                ✔ Tip1. 마우스를 올리면 동물상 대표 연예인들을 볼 수 있어요!
                <br />✔ Tip2. 동물상은 3개까지 선택 가능해요!
              </Typography>
            </Box>
          </Fade>
        </Modal>
      </div>
      {userGender == "male" ? <ForMale /> : <ForFemale />}
    </div>
  );
};

export default MainPage;
