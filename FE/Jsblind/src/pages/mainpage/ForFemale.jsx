import React, { useState } from "react";
import QuickMatch from "pages/mainpage/QuickMatch";
import "common/pageCss/mainpage.css";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ForFemale() {
  const [animal, setAnimal] = useState("");
  const [animalList, setAnimalList] = useState([]);
  const [animalInfo, setAnimalInfo] = useState({
    dog: false,
    bear: false,
    dinosaur: false,
    wolf: false,
    rabbit: false,
    horse: false,
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
              src="Images/animals/bear_m.png"
              alt="bear"
              value="bear"
              onClick={selectAnimal}
            />
            <div className="group-caption">
              <p className="group-people-web web-mode">
                조진웅, 김태우, 안재홍, 마동석, 박성웅 등
              </p>
              <p className="group-people-mobile mobile-mode">
                조진웅, 김태우, 안재홍, 마동석, 박성웅 등
              </p>
              <span className="animal-group">
                곰상{" "}
                {animalList.includes("bear") ? (
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
              src="Images/animals/dinosaur_m.png"
              alt="dinosaur"
              value="dinosaur"
              onClick={selectAnimal}
            />
            <div className="group-caption">
              <p className="group-people-web web-mode">
                공유, 김우빈, 동해, 육성재, 김영광 등
              </p>
              <p className="group-people-mobile mobile-mode">
                공유, 김우빈, 동해, 육성재, 김영광 등
              </p>
              <span className="animal-group">
                공룡상{" "}
                {animalList.includes("dinosaur") ? (
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
              src="Images/animals/dog_m.png"
              alt="dog"
              value="dog"
              onClick={selectAnimal}
            />
            <div className="group-caption">
              <p className="group-people-web web-mode">
                박보검, 송중기, 백현, 임시완, 정해인 등
              </p>
              <p className="group-people-mobile mobile-mode">
                박보검, 송중기, 백현, 임시완, 정해인 등
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
              src="Images/animals/horse_m.png"
              alt="horse"
              value="horse"
              onClick={selectAnimal}
            />
            <div className="group-caption">
              <p className="group-people-web web-mode">
                강타, 최시원, 김민준, 박정민, 준케이 등
              </p>
              <p className="group-people-mobile mobile-mode">
                강타, 최시원, 김민준, 박정민, 준케이 등
              </p>
              <span className="animal-group">
                말상{" "}
                {animalList.includes("horse") ? (
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
              src="Images/animals/wolf_m.png"
              alt="wolf"
              value="wolf"
              onClick={selectAnimal}
            />
            <div className="group-caption">
              <p className="group-people-web web-mode">
                강동원, 서강준, 뷔, 세훈, 김남길 등
              </p>
              <p className="group-people-mobile mobile-mode">
                강동원, 서강준, 뷔, 세훈, 김남길 등
              </p>
              <span className="animal-group">
                늑대상{" "}
                {animalList.includes("wolf") ? (
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
              src="Images/animals/rabbit_m.png"
              alt="rabbit"
              value="rabbit"
              onClick={selectAnimal}
            />
            <div className="group-caption">
              <p className="group-people-web web-mode">
                정국, 수호, 려욱, 태민, 도영 등
              </p>
              <p className="group-people-mobile mobile-mode">
                정국, 수호, 려욱, 태민, 도영 등
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
