import React, { useEffect } from "react";
import "common/pageCss/mypage.css";
import useToggle from "common/hook/useToggle";
import FrList from "pages/userpage/myPage/components/FrList";
import useInput from "common/hook/useInput";
import Guide from "pages/userpage/myPage/components/GA";
import { useDispatch, useSelector } from "react-redux";
import history from "utils/history";
import { updateActions } from "redux/slice/updateSlice";
import { myPageActions } from "redux/slice/mypageSlice";
import { frListActions } from "redux/slice/frListSlice";
import EditIcon from "@mui/icons-material/Edit";
import "pages/userpage/myPage/mobile.css";

const token = localStorage.getItem("token");

const MyPage = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.myPageReducer.data.data);
  const fr = useSelector((state) => state.frListReducers.data.data);

  const animalNameD = {
    wolf: "늑대",
    dinosaur: "공룡",
    horse: "말",
    bear: "곰",
    rabbit: "토끼",
    dog: "강아지",
    squirtle: "꼬부기",
    deer: "사슴",
    cat: "고양이",
    fox: "여우",
  };
  let animaName = animalNameD[user && user.animal];
  const nick = localStorage.getItem("nickname");
  const error = useSelector((state) => state.myPageReducer.error);
  const [onGuide, onGuideToggle] = useToggle(false);
  const [EditProfileToggle, onEditProfileToggle] = useToggle(true);
  const [nicknameValue, onChangeNickname] = useInput(nick);
  const [keyword1, onChangeKeyword1] = useInput("");
  const [keyword2, onChangeKeyword2] = useInput("");
  const [keyword3, onChangeKeyword3] = useInput("");
  const [keyword4, onChangeKeyword4] = useInput("");
  const [keyword5, onChangeKeyword5] = useInput("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (
      nicknameValue === "" ||
      nicknameValue === null ||
      nicknameValue === undefined
    ) {
      alert("닉네임 변경해주세요!");
      return false;
    }
    if (keyword1 === "" || keyword1 === null || keyword1 === undefined) {
      alert("키워드는 3개 이상 작성해주세요");
      return false;
    }
    if (keyword2 === "" || keyword2 === null || keyword2 === undefined) {
      alert("키워드는 3개 이상 작성해주세요");
      return false;
    }
    if (keyword3 === "" || keyword3 === null || keyword3 === undefined) {
      alert("키워드는 3개 이상 작성해주세요");
      return false;
    }

    const edit = {
      nickname: nicknameValue,
      introduction_keyword1: keyword1,
      introduction_keyword2: keyword2,
      introduction_keyword3: keyword3,
      introduction_keyword4: keyword4,
      introduction_keyword5: keyword5,
    };

    dispatch(updateActions.updateProfile(edit));
    dispatch(myPageActions.getMyPage(token));
    onEditProfileToggle(!EditProfileToggle);
  };
  useEffect(() => {
    dispatch(myPageActions.getMyPage(token));
    dispatch(frListActions.getFrList(token));
  }, [dispatch, token]);

  const onLogOut = () => {
    localStorage.removeItem("nickname");
    localStorage.removeItem("token");
    history.push("/");
  };

  const onDelete = (friend) => {
    const data = {
      token: token,
      name: friend,
    };
    dispatch(frListActions.deleteFr(data));
    dispatch(frListActions.getFrList(data.token));
  };
  const goToMain = () => {
    history.push("/main");
  };
  const goToImg = () => {
    history.push("/imageupload");
  };

  return (
    <div className="mb_option">
      <div className="top_option">
        <ul>
          <button>
            <Guide />
          </button>
          <button onClick={goToMain}>메인으로</button>
          <button onClick={onEditProfileToggle}>
            {EditProfileToggle ? "프로필수정" : "수정취소"}{" "}
          </button>
          <button onClick={onLogOut}>로그아웃</button>
        </ul>
      </div>
      <div className="header">
        {user && (
          <img
            alt="user_img"
            src={`https://j5c105.p.ssafy.io/api-boot/profile/image/${user.id}`}
            sizes="100%"
          />
        )}

        <p onClick={goToImg} className="edit_img">
          <EditIcon />
          수정
        </p>
        <div className="userinfo">
          {EditProfileToggle ? (
            <div className="info">
              <ul className="info1">
                <li>
                  닉네임:
                  <h4
                    style={{
                      display: "inline-block",
                      color: "rgb(135, 25, 135)",

                      marginLeft: "10px",
                    }}
                  >
                    {user && user.nickname}
                  </h4>
                </li>
                <li>
                  동물상:
                  <h4
                    style={{
                      display: "inline-block",
                      color: "rgb(135, 25, 135)",

                      marginLeft: "10px",
                    }}
                  >
                    {animaName}
                  </h4>
                </li>
                <li>
                  생일:
                  <h4
                    style={{
                      display: "inline-block",
                      color: "rgb(135, 25, 135)",

                      marginLeft: "10px",
                    }}
                  >
                    {user && user.birthday}
                  </h4>
                </li>
              </ul>
              <ul className="info2">
                <li>
                  ⭐동물상정확도:
                  <h4
                    style={{
                      display: "inline-block",
                      color: "#f48347",
                      marginLeft: "5px",
                    }}
                  >
                    {user && user.animal_accuracy}
                  </h4>
                </li>
                <li>
                  ⭐리뷰수:
                  <h4
                    style={{
                      display: "inline-block",
                      color: "#f48347",
                      marginLeft: "10px",
                    }}
                  >
                    {user && user.reviewCount}
                  </h4>
                </li>
                <li>
                  ⭐호감도:
                  <h4
                    style={{
                      display: "inline-block",
                      color: "#f48347",
                      marginLeft: "10px",
                    }}
                  >
                    {user && user.likeability}
                  </h4>
                </li>
                <li>
                  ⭐유머도:
                  <h4
                    style={{
                      display: "inline-block",
                      color: "#f48347",
                      marginLeft: "10px",
                    }}
                  >
                    {user && user.humorous}
                  </h4>
                </li>
                <li>
                  ⭐매너:
                  <h4
                    style={{
                      display: "inline-block",
                      color: "#f48347",
                      marginLeft: "10px",
                    }}
                  >
                    {user && user.manner}
                  </h4>
                </li>
              </ul>
            </div>
          ) : (
            <form onSubmit={onSubmit}>
              <ul>
                <li id="name_input">
                  닉네임:{" "}
                  <input
                    value={nicknameValue}
                    name="nicknameValue"
                    onChange={onChangeNickname}
                    maxLength={8}
                  />
                </li>
              </ul>
            </form>
          )}
        </div>
      </div>
      <div className="user_intro">
        <div className="guide">
          {onGuide ? (
            <>
              <Guide />
            </>
          ) : null}
        </div>
        <div className="intro_toggle">
          <p style={{ color: "black", textShadow: "0.5px 0.5px  black" }}>
            자기소개키워드
          </p>
        </div>
        {EditProfileToggle ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "10px",
            }}
          >
            <h3 style={{ color: "navy", textShadow: "0.5px 0.5px 0.5px grey" }}>
              {user && user.introduction_keyword1}
            </h3>
            <h3 style={{ color: "navy", textShadow: "0.5px 0.5px 0.5px grey" }}>
              {user && user.introduction_keyword2}
            </h3>
            <h3 style={{ color: "navy", textShadow: "0.5px 0.5px 0.5px grey" }}>
              {user && user.introduction_keyword3}
            </h3>
            <h3 style={{ color: "navy", textShadow: "0.5px 0.5px 0.5px grey" }}>
              {user && user.introduction_keyword4}
            </h3>
            <h3 style={{ color: "navy", textShadow: "0.5px 0.5px 0.5px grey" }}>
              {user && user.introduction_keyword5}
            </h3>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <div id="key_input">
              <input
                value={keyword1}
                name="keyword1"
                onChange={onChangeKeyword1}
                type="text"
                maxLength={5}
                placeholder="키워드1"
              />
              <input
                value={keyword2}
                name="keyword2"
                onChange={onChangeKeyword2}
                type="text"
                maxLength={5}
                placeholder="키워드2"
              />
              <input
                value={keyword3}
                name="keyword3"
                onChange={onChangeKeyword3}
                type="text"
                maxLength={5}
                placeholder="키워드3"
              />
              <input
                value={keyword4}
                name="keyword4"
                onChange={onChangeKeyword4}
                type="text"
                maxLength={5}
                placeholder="키워드4"
              />
              <input
                value={keyword5}
                name="keyword5"
                onChange={onChangeKeyword5}
                type="text"
                maxLength={5}
                placeholder="키워드5"
              />
            </div>
            <button onClick={onSubmit}>수정하기</button>
          </form>
        )}
      </div>
      <div className="friends">
        <FrList fr={fr} onDelete={onDelete} goToMain={goToMain} />
      </div>
    </div>
  );
};

export default MyPage;
