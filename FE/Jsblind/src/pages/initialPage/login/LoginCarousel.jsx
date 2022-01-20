import React from "react";
import Carousel from "react-material-ui-carousel";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import EcoIcon from "@material-ui/icons/Eco";

function LoginCarousel() {
  const items = [
    {
      img: "Images/tutorial1.png",
    },
    {
      img: "Images/tutorial2.png",
    },
    {
      img: "Images/tutorial3.png",
    },
  ];

  return (
    <Carousel
      NextIcon={<SkipNextIcon />}
      PrevIcon={<SkipPreviousIcon />}
      navButtonsAlwaysInvisible={true}
      IndicatorIcon={<EcoIcon />}
      indicatorIconButtonProps={{
        style: {
          padding: "5px",
        },
      }}
      activeIndicatorIconButtonProps={{
        style: {
          backgroundColor: "#d4b0f1",
        },
      }}
      interval={5000}
      indicators={true}
      stopAutoPlayOnHover={false}
    >
      {items.map((item, i) => (
        <div className="login-carousel-body">
          <h3>{item.name}</h3>
          <img src={item.img} width="50%" height="50%" alt="tutorial" />
        </div>
      ))}
    </Carousel>
  );
}

export default LoginCarousel;
