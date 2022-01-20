import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import logo from "pages/userpage/myPage/logo1.png";
import "pages/userpage/myPage/components/FrList.css";
import history from "utils/history";
import Swal from "sweetalert2";
import lion from "pages/userpage/myPage/components/lion.png";
import "pages/userpage/myPage/components/mb.css";
import bear from "pages/userpage/myPage/animals/bear_m.png";
import wolf from "pages/userpage/myPage/animals/wolf_m.png";
import dinosaur from "pages/userpage/myPage/animals/dinosaur_m.png";
import dogM from "pages/userpage/myPage/animals/dog_m.png";
import horse from "pages/userpage/myPage/animals/horse_m.png";
import rabbitM from "pages/userpage/myPage/animals/rabbit_m.png";

import dogW from "pages/userpage/myPage/animals/dog_w.png";
import rabbitW from "pages/userpage/myPage/animals/rabbit_w.png";
import squirtle from "pages/userpage/myPage/animals/squirtle_w.png";
import deer from "pages/userpage/myPage/animals/deer_w.png";
import cat from "pages/userpage/myPage/animals/cat_w.png";
import fox from "pages/userpage/myPage/animals/fox_w.png";

export default function FrList({ fr, onDelete, goToMain }) {
  const goChat = (frname) => {
    const name = localStorage.getItem("nickname");
    let n1 = "";
    let n2 = "";
    if (name > frname) {
      n1 = name;
      n2 = frname;
    } else {
      n1 = frname;
      n2 = name;
    }
    history.push(`/chat?name=${name}&room=${n1}&${n2}`);
  };
  const animalDicM = {
    wolf: wolf,
    dinosaur: dinosaur,
    horse: horse,
    dog: dogM,
    bear: bear,
    rabbit: rabbitM,
  };

  const animalDicW = {
    dog: dogW,
    rabbit: rabbitW,
    squirtle: squirtle,
    deer: deer,
    cat: cat,
    fox: fox,
  };

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
  const [toggle, setToggle] = useState(false);
  const frImgToggle = () => {
    setToggle(!toggle);
  };
  return (
    <>
      {fr && fr.data.length > 0 ? (
        <>
          {fr &&
            fr.data.map((data) => (
              <List sx={{ width: "100%" }}>
                <Divider variant="inset" component="li" />
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    {toggle ? (
                      <>
                        {data.gender === "male" ? (
                          <Avatar alt="user_fr" src={animalDicM[data.animal]} />
                        ) : (
                          <Avatar alt="user_fr" src={animalDicW[data.animal]} />
                        )}
                      </>
                    ) : (
                      <Avatar
                        alt="user_fr"
                        src={`https://j5c105.p.ssafy.io/api-boot/profile/image/${data.id}`}
                      />
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={data.nickname}
                    secondary={
                      <div className="fr_intro">
                        <ul className="fr_detail">
                          {toggle ? (
                            <li className="item">
                              {animalNameD[data.animal]}상
                            </li>
                          ) : null}
                          <li className="item">#{data.keyword1}</li>
                          <li className="item">#{data.keyword2}</li>
                          <li className="item">#{data.keyword3}</li>
                          <li id="delete_key" className="item">
                            #{data.keyword4}
                          </li>
                          <li className="item">#{data.keyword5}</li>
                        </ul>
                        <ul className="fr_option">
                          <li onClick={() => frImgToggle()} className="item">
                            animal
                          </li>
                          <li
                            onClick={() => goChat(data.nickname)}
                            className="item"
                          >
                            chat
                          </li>

                          <li
                            onClick={() => onDelete(data.id)}
                            className="item"
                          >
                            del
                          </li>
                        </ul>
                      </div>
                    }
                  />
                </ListItem>
              </List>
            ))}
        </>
      ) : (
        <>
          <div className="fr_null">
            <div className="fr_text">매칭을 통해 친구를 만들어 보세요!</div>
            <br />
            <button onClick={goToMain} className="quick_btn">
              매칭하러가기
            </button>
          </div>
        </>
      )}
    </>
  );
}
