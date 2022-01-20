import React, { useState } from "react";
import QuickMatch from "pages/mainpage/QuickMatch";
import "common/pageCss/mainpage.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ForMale() {
  const [animal, setAnimal] = useState("");
  const [animalList, setAnimalList] = useState([]);
  const [animalInfo, setAnimalInfo] = useState({
    dog: false,
    rabbit: false,
    cat: false,
    deer: false,
    fox: false,
    squirtle: false,
  });

  const selectAnimal = (e) => {
    const targetAnimal = e.target.value;
    setAnimal(targetAnimal);
    if (animalList.includes(targetAnimal)) {
      animalList.splice(animalList.indexOf(targetAnimal), 1);
      setAnimalInfo((prevAnimalInfo) => ({
        ...prevAnimalInfo,
        targetAnimal: false,
      }));
    } else {
      animalList.push(targetAnimal);
      setAnimalInfo((prevAnimalInfo) => ({
        ...prevAnimalInfo,
        targetAnimal: true,
      }));
    }
    if (animalList.length >= 4) {
      animalList.shift();
    }
  };

  return (
    <div>
      <div className="group-info">
        <div className="animals">
          <div className="animal-info">
            <input
              type="image"
              className="animal-image"
              src="Images/animals/squirtle_w.png"
              alt="squirtle"
              value="squirtle"
              onClick={selectAnimal}
            />
            <div className="group-caption">
              <p className="group-people-web web-mode">
                솔라, 예리, 유정, 하연수, 강민경 등
              </p>
              <p className="group-people-mobile mobile-mode">
                솔라, 예리, 유정, 하연수, 강민경 등
              </p>
              <span className="animal-group">
                꼬부기상{" "}
                {animalList.includes("squirtle") ? (
                  <CheckCircleIcon />
                ) : (
                  <CheckCircleOutlineIcon />
                )}
              </span>
            </div>
          </div>
          <div className="animal-info">
            <input
              type="image"
              className="animal-image"
              src="Images/animals/deer_w.png"
              alt="deer"
              value="deer"
              onClick={selectAnimal}
            />
            <div className="group-caption">
              <p className="group-people-web web-mode">
                윤아, 한지민, 정유미, 고아라, 이연희 등
              </p>
              <p className="group-people-mobile mobile-mode">
                윤아, 한지민, 정유미, 고아라, 이연희 등
              </p>
              <span className="animal-group">
                사슴상{" "}
                {animalList.includes("deer") ? (
                  <CheckCircleIcon />
                ) : (
                  <CheckCircleOutlineIcon />
                )}
              </span>
            </div>
          </div>
          <div className="animal-info">
            <input
              type="image"
              className="animal-image"
              src="Images/animals/dog_w.png"
              alt="dog"
              value="dog"
              onClick={selectAnimal}
            />
            <div className="group-caption">
              <p className="group-people-web web-mode">
                박보영, 문근영, 장나라, 임수정, 한가인 등
              </p>
              <p className="group-people-mobile mobile-mode">
                박보영, 문근영, 장나라, 임수정, 한가인 등
              </p>
              <span className="animal-group">
                강아지상{" "}
                {animalList.includes("dog") ? (
                  <CheckCircleIcon />
                ) : (
                  <CheckCircleOutlineIcon />
                )}
              </span>
            </div>
          </div>
          <div className="animal-info">
            <input
              type="image"
              className="animal-image"
              src="Images/animals/fox_w.png"
              alt="fox"
              value="fox"
              onClick={selectAnimal}
            />
            <div className="group-caption">
              <p className="group-people-web web-mode">
                지연, 한혜진, 쯔위, 경리, 슬기 등
              </p>
              <p className="group-people-mobile mobile-mode">
                지연, 한혜진, 쯔위, 경리, 슬기 등
              </p>
              <span className="animal-group">
                여우상{" "}
                {animalList.includes("fox") ? (
                  <CheckCircleIcon />
                ) : (
                  <CheckCircleOutlineIcon />
                )}
              </span>
            </div>
          </div>
          <div className="animal-info">
            <input
              type="image"
              className="animal-image"
              src="Images/animals/cat_w.png"
              alt="cat"
              value="cat"
              onClick={selectAnimal}
            />
            <div className="group-caption">
              <p className="group-people-web web-mode">
                이효리, 한예슬, 한소희, 안소희, 유인영 등
              </p>
              <p className="group-people-mobile mobile-mode">
                이효리, 한예슬, 한소희, 안소희, 유인영 등
              </p>
              <span className="animal-group">
                고양이상{" "}
                {animalList.includes("cat") ? (
                  <CheckCircleIcon />
                ) : (
                  <CheckCircleOutlineIcon />
                )}
              </span>
            </div>
          </div>
          <div className="animal-info">
            <input
              type="image"
              className="animal-image"
              src="Images/animals/rabbit_w.png"
              alt="rabbit"
              value="rabbit"
              onClick={selectAnimal}
            />
            <div className="group-caption">
              <p className="group-people-web web-mode">
                나연, 다현, 아이유 , 수지, 아이린 등
              </p>
              <p className="group-people-mobile mobile-mode">
                나연, 다현, 아이유 , 수지, 아이린 등
              </p>
              <span className="animal-group">
                토끼상{" "}
                {animalList.includes("rabbit") ? (
                  <CheckCircleIcon />
                ) : (
                  <CheckCircleOutlineIcon />
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="quick-match">
        <QuickMatch animal={animal} animalList={animalList} />
      </div>
    </div>
  );
}
