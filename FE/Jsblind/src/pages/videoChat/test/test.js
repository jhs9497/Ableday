import React from 'react';
import { Button, Nav, NavItem, NavLink } from 'reactstrap';
import html2canvas from 'html2canvas';

const getWebcam = (callback) => {
  try {
    const constraints = {
      video: true,
      audio: false,
    };
    navigator.mediaDevices.getUserMedia(constraints).then(callback);
  } catch (err) {
    // console.log(err);
    return undefined;
  }
};

const Styles = {
  Video: { width: '30vw', background: 'rgba(245, 240, 215, 0.5)', border: '1px solid green' },
  Canvas: { width: '30vw', background: 'rgba(245, 240, 215, 0.5)', border: '1px solid green' },
  None: { display: 'none' },
};

function WebcamCanvas() {
  

  const videoRef = React.useRef(null);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    getWebcam((stream) => {
      videoRef.current.srcObject = stream;
      // console.log(videoRef.current.srcObject, '여기다 src');
    });
  }, []);

  const drawToCanvas = () => {
    try {
      const ctx = canvasRef.current.getContext('2d');
      // console.log(ctx, '여기가 ctx입니다');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;

      if (ctx && ctx !== null) {
        if (videoRef.current) {
          // console.log('1');
          ctx.translate(canvasRef.current.width, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.setTransform(1, 0, 0, 1, 0, 0);
        }
        console.log('2');
        ctx.fillStyle = 'white';
        ctx.fillRect(10, 10, 100, 50);
        ctx.font = '15px Arial';
        ctx.fillStyle = 'green';
        ctx.fillText('Ruben Choi', 15, 30);
      }
    } catch (err) {
      // console.log(err);
    }
  };
  const [timer, setTimer] = React.useState(undefined);

  const startOrStop = () => {
    if (!timer) {
      const t = setInterval(() => drawToCanvas(), 10);
      setTimer(t);
    } else {
      clearInterval(timer);
      setTimer(undefined);
    }
  };

  const onCapture = () => {
    console.log('capture');
    html2canvas(document.getElementById('div')).then((canvas) => {
      onSaveAs(canvas.toDataURL('image/jpg'), 'image-download.jpg');
    });
  };
  const onSaveAs = (uri, filename) => {
    console.log('onsave');
    var link = document.createElement('a');
    document.body.appendChild(link);
    console.log(uri)
    link.href = uri;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div style={{ width: '100vw', height: '100vh', padding: '3em' }}>
        <table>
          <thead>
            <tr>
              <td>Video</td>
              <td>Canvas</td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <video ref={videoRef} autoPlay style={Styles.Video} hidden />
              </td>
              <td>
                <canvas id="div" ref={canvasRef} style={Styles.Canvas} />
              </td>
            </tr>
          </tbody>
          <button onClick={onCapture}>save</button>
        </table>
        <hr />
        <Button color="warning" onClick={() => drawToCanvas()}>
          Draw to Canvas{' '}
        </Button>
        <hr />
        <Button color="warning" onClick={() => startOrStop()}>
          {timer ? 'Stop' : 'Repeat (0.1s)'}{' '}
        </Button>
      </div>
      <hr />
      <Nav pills>
        <NavItem>
          <NavLink href="https://rubenchoi.tistory.com/21" active target="_blank">
            [Tutorial] React 웹캠 - 3. Canvas
          </NavLink>
        </NavItem>
      </Nav>
    </>
  );
}

export default WebcamCanvas;
