import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

function SnabTest() {
  const [playing, setPlaying] = useState(undefined);

  const videoRef = useRef(null);

  useEffect(() => {
    getWebcam((stream) => {
      setPlaying(true);
      videoRef.current.srcObject = stream;
    });
  }, []);

  const getWebcam = (callback) => {
    try {
      const constraints = {
        video: true,
        audio: false,
      };
      navigator.mediaDevices.getUserMedia(constraints).then(callback);
    } catch (err) {
      console.log(err);
      return undefined;
    }
  };

  const Styles = {
    Video: { width: '400px', height: '400px', background: 'rgba(245, 240, 215, 0.5)' },
    None: { display: 'none' },
  };

  const startOrStop = () => {
    if (playing) {
      const s = videoRef.current.srcObject;
      s.getTracks().forEach((track) => {
        track.stop();
      });
    } else {
      getWebcam((stream) => {
        setPlaying(true);
        videoRef.current.srcObject = stream;
      });
    }
    setPlaying(!playing);
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
    link.href = uri;
    link.download = filename;
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div style={{ width: '100vw', height: '100vh', padding: '3em' }}>
        <video id="div" ref={videoRef} autoPlay style={Styles.Video} />
        <button onClick={() => startOrStop()}>{playing ? 'Stop' : 'Start'} 버튼</button>
        <hr />
        <button onClick={onCapture}>save</button>
      </div>
    </>
  );
}

export default SnabTest;
