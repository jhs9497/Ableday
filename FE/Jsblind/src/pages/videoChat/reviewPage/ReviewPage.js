import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Backdrop from '@mui/material/Backdrop';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import { reviewActions } from 'redux/slice/reviewSlice';

import axios from 'axios'
// import { reviewActions } from 'common/redux/slice/reviewSlice';

const ReviewPage = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  console.log("성공?", props.pairInfo);

  const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  const [open, setOpen] = React.useState(true);
  const [submit, seSubmit] = useState(false);
  const [review, setReview] = useState({
    manner: '',
    interesting: '',
    accuracy: '',
    like: '',
  })

  const handleSubmit = () => {
    const userId = JSON.stringify(props.pairInfo.id)
    const id = userId.substring(1, 14);
    // const id = userId.replace(/"/, "");
    console.log(id, typeof id, "리뷰 아이디");
    
    const data = {
      id: id,
      manner: review.manner,
      humorous: review.interesting,
      animal_accuracy: review.accuracy,
      likeability: review.like,
    };
    console.log(data)
    const token = localStorage.getItem("token");
    seSubmit(true);
    axios({
      method: "post",
      url: "https://j5c105.p.ssafy.io/api-boot/profile/review",
      headers: {
        "Content-Type": `application/json`,
        Authorization: `Bearer ${token}`,
      },
      data: data,
    })
      .then(() => {
        console.log("성공");
      })
  };

  const handleMannerScore = (e) => {
    const score = Number(e.target.value)
    setReview({
      ...review,
      manner: score,
    });
  };

  const handleInterstingScore = (e) => {
    const score = Number(e.target.value);
    setReview({
      ...review,
      interesting: score,
    });
  };

  const handleAccuracyScore = (e) => {
    const score = Number(e.target.value);
    setReview({
      ...review,
      accuracy: score,
    });
  };

  const handleLikeScore= (e) => {
    const score = Number(e.target.value);
    setReview({
      ...review,
      like: score,
    });
  }

  const handleTotalScore = () => {
    if (Object.values(review).some((x) => x === '' || x.length === 0)) {
      return false;
    }
    return true;
  };

  const goToHome = () => {
    window.location.href = "/main";
  };


  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    height: 600,
    bgcolor: 'white',
    border: '2px solid var(--lightPurple)',
    // borderRadius: "20px",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
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
              <div className="review-reviewbox">
                <h1>블라인드 데이트 어땠나요 ?</h1>
                <h3>매너</h3>
                <div className="review-star-box">
                  <div className="star-rating">
                    <input
                      type="radio"
                      id="5-stars"
                      name="rating1"
                      value="5"
                      onClick={handleMannerScore}
                    />
                    <label htmlFor="5-stars" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="4-stars"
                      name="rating1"
                      value="4"
                      onClick={handleMannerScore}
                    />
                    <label htmlFor="4-stars" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="3-stars"
                      name="rating1"
                      value="3"
                      onClick={handleMannerScore}
                    />
                    <label htmlFor="3-stars" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="2-stars"
                      name="rating1"
                      value="2"
                      onClick={handleMannerScore}
                    />
                    <label htmlFor="2-stars" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="1-star"
                      name="rating1"
                      value="1"
                      onClick={handleMannerScore}
                    />
                    <label htmlFor="1-star" className="star">
                      &#9733;
                    </label>
                  </div>
                </div>
                <h3>유머</h3>
                <div className="review-star-box">
                  <div className="star-rating">
                    <input
                      type="radio"
                      id="5-stars2"
                      name="rating2"
                      value="5"
                      onClick={handleInterstingScore}
                    />
                    <label htmlFor="5-stars2" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="4-stars2"
                      name="rating2"
                      value="4"
                      onClick={handleInterstingScore}
                    />
                    <label htmlFor="4-stars2" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="3-stars2"
                      name="rating2"
                      value="3"
                      onClick={handleInterstingScore}
                    />
                    <label htmlFor="3-stars2" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="2-stars2"
                      name="rating2"
                      value="2"
                      onClick={handleInterstingScore}
                    />
                    <label htmlFor="2-stars2" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="1-star2"
                      name="rating2"
                      value="1"
                      onClick={handleInterstingScore}
                    />
                    <label htmlFor="1-star2" className="star">
                      &#9733;
                    </label>
                  </div>
                </div>

                <h3>호감도</h3>
                <div className="review-star-box">
                  <div className="star-rating">
                    <input
                      type="radio"
                      id="5-stars3"
                      name="rating3"
                      value="5"
                      onClick={handleLikeScore}
                    />
                    <label htmlFor="5-stars3" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="4-stars3"
                      name="rating3"
                      value="4"
                      onClick={handleLikeScore}
                    />
                    <label htmlFor="4-stars3" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="3-stars3"
                      name="rating3"
                      value="3"
                      onClick={handleLikeScore}
                    />
                    <label htmlFor="3-stars3" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="2-stars3"
                      name="rating3"
                      value="2"
                      onClick={handleLikeScore}
                    />
                    <label htmlFor="2-stars3" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="1-star3"
                      name="rating3"
                      value="1"
                      onClick={handleLikeScore}
                    />
                    <label htmlFor="1-star3" className="star">
                      &#9733;
                    </label>
                  </div>
                </div>
                <h3>동물상 유사도</h3>
                <div className="review-star-box">
                  <div className="star-rating">
                    <input
                      type="radio"
                      id="5-stars4"
                      name="rating4"
                      value="5"
                      onClick={handleAccuracyScore}
                    />
                    <label htmlFor="5-stars4" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="4-stars4"
                      name="rating4"
                      value="4"
                      onClick={handleAccuracyScore}
                    />
                    <label htmlFor="4-stars4" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="3-stars4"
                      name="rating4"
                      value="3"
                      onClick={handleAccuracyScore}
                    />
                    <label htmlFor="3-stars4" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="2-stars4"
                      name="rating4"
                      value="2"
                      onClick={handleAccuracyScore}
                    />
                    <label htmlFor="2-stars4" className="star">
                      &#9733;
                    </label>
                    <input
                      type="radio"
                      id="1-star4"
                      name="rating4"
                      value="1"
                      onClick={handleAccuracyScore}
                    />
                    <label htmlFor="1-star4" className="star">
                      &#9733;
                    </label>
                  </div>
                </div>

                <button
                  className={
                    handleTotalScore()
                      ? "btn-sm review-submit-btn"
                      : "btn-sm review-submit-disalbe-btn"
                  }
                  onClick={handleSubmit}
                  variant="outlined"
                >
                  제출하기
                </button>
              </div>
            </Typography>
          </Box>
        </Fade>
      </Modal>
      {submit ? (
        <div>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>{"리뷰에 참여해주셔서 감사합니다!"}</DialogTitle>
            <div className="review-move-btn-box">
              <button className="btn-sm" onClick={goToHome}>
                HOME
              </button>
            </div>
          </Dialog>
        </div>
      ) : null}
    </>
  );
};

export default ReviewPage;
