import { useEffect, useState } from "react";
import ReactDOM, { unmountComponentAtNode } from "react-dom";
import HeartButton from './HeartButton'

const HeartsGenerator = (props) => {
  // <div className="heart" />

  const onClick = () => {
    const dom = document.createElement("div");
    document.getElementById("heart-generator").appendChild(dom);
    return ReactDOM.render(<Heart node={dom} />, dom);
  };

  return (
    <div id="heart-generator">
      <HeartButton onClick={onClick} expression={props.expression} trigger={props.trigger}/>
    </div>
  );
};

const Heart = ({ node }) => {
  const range = 50;
  const left_origin = 150;
  const angularSpeed = 0.05;
  const riseSpeed = 4;
  const [left, setLeft] = useState(left_origin + Math.sin(0) * range);
  const [bottom, setBottom] = useState(0);
  const [theta, setTheta] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      unmountComponentAtNode(node);
    }, 10000);
  }, []);

  useEffect(() => {
    const token = setInterval(() => {
      setTheta(theta + angularSpeed);
      setBottom(bottom + riseSpeed);
      // x_intitial + Math.sin(45) * 50;
      setLeft(left_origin + Math.sin(theta) * range);
    }, 20);

    return () => {
      clearInterval(token);
    };
  }, [left, setLeft, bottom, setBottom, theta, setTheta]);

  return <div className="heart" style={{ bottom, left }} />;
};

export default HeartsGenerator;
