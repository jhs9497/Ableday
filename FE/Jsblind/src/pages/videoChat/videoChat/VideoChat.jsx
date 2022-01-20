import axios from "axios";
import { OpenVidu } from "openvidu-browser";
import React, { Component } from "react";
import "../../../common/pageCss/videoChat.css";
import "./Index.css";
import Swal from "sweetalert2";
import UserVideoComponent from "./UserVideoComponent";
import {
  BsChatDots,
  BsPersonPlus,
  BsFillVolumeUpFill,
  BsFillVolumeMuteFill,
  BsFillMicFill,
} from "react-icons/bs";
import { RiCameraLine, RiCameraOffLine } from "react-icons/ri";
import { GiDominoMask } from "react-icons/gi";
import { VscSymbolBoolean } from "react-icons/vsc";
import ReviewPage from "../reviewPage/ReviewPage";
// const OPENVIDU_SERVER_URL = "https://" + window.location.hostname + ":4443";
const OPENVIDU_SERVER_URL = "https://j5c105.p.ssafy.io:5443";
const OPENVIDU_SERVER_SECRET = "MY_SECRET";

class VideoChat extends Component {
  constructor(props) {
    super(props);
    console.log("video", props.roomdata.pairInfo);
    this.state = {
      mySessionId: "Session" + props.roomdata.roomName,
      myUserName: props.nickname,
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
      friendName: undefined,
      camera: true,
      sound: true,
      animal: false,
      myAnimal: true,
      yourAnimal: true,
      review: false,
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.onbeforeunload);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          var video = document.getElementById("video");
          video.srcObject = stream;
          video.play();
        });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
  }

  onbeforeunload(event) {
    this.leaveSession();
  }

  handleChangeSessionId(e) {
    this.setState({
      mySessionId: e.target.value,
    });
  }

  handleChangeUserName(e) {
    this.setState({
      myUserName: e.target.value,
    });
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({
        mainStreamManager: stream,
      });
    }
  }

  handleOpenCamera() {
    this.setState({
      camera: true,
      myAnimal: true,
    });
    this.openCamera();
    this.state.publisher.publishVideo(true);
  }

  handleCloseCamera() {
    this.setState({
      camera: false,
      myAnimal: false,
    });
    this.closeCamera();
    this.state.publisher.publishVideo(false);
  }

  handleOpenSound() {
    this.setState({
      sound: true,
    });
    this.state.publisher.publishAudio(true);
  }

  handleCloseSound() {
    this.setState({
      sound: false,
    });
    this.state.publisher.publishAudio(false);
  }

  handleMic() {
    this.setState({
      mic: !this.state.mic,
    });
  }

  handleAnimal() {
    this.setState({
      animal: !this.state.animal,
    });
    const session = this.state.session;

    session
      .signal({
        data: "hey", // Any string (optional)
        to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
        type: "my-chat", // The type of message (optional)
        from: this.state.myUserName,
      })
      .then(() => {
        this.setState({
          myAnimal: !this.state.myAnimal,
        });
        console.log("Message successfully sent");
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleAddFriend() {
    Swal.fire({
      title: "친구 추가 하시겠습니까 ?",
      showDenyButton: true,
      confirmButtonText: "Yes!",
      confirmButtonColor: "#3085d6",
      denyButtonText: "No!",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const token = localStorage.getItem("token");
        const data = {
          userId: this.props.roomdata.pairInfo.id,
        };
        axios({
          method: "post",
          url: "https://j5c105.p.ssafy.io/api-boot/friend",
          headers: {
            "Content-Type": `application/json`,
            Authorization: `Bearer ${token}`,
          },
          data: data,
        });
      }
    });
  }

  handlereview() {
    this.setState({
      review: true,
    });
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({
        subscribers: subscribers,
      });
    }
  }

  joinSession() {
    this.OV = new OpenVidu();

    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        var mySession = this.state.session;
        mySession.on("streamCreated", (event) => {
          var subscriber = mySession.subscribe(event.stream, undefined);
          var subscribers = this.state.subscribers;
          subscribers.push(subscriber);
          this.setState({
            subscribers: subscribers,
          });
        });

        mySession.on("streamDestroyed", (event) => {
          this.deleteSubscriber(event.stream.streamManager);
        });

        mySession.on("signal", (event) => {
          console.log(event.data, typeof event.data);
          const chatUser = JSON.parse(event.from.data);
          if (
            event.data === "hey" &&
            this.state.myUserName !== chatUser.clientData
          ) {
            this.setState({
              yourAnimal: !this.state.yourAnimal,
            });
          } else if (
            event.data === "open" &&
            this.state.myUserName !== chatUser.clientData
          ) {
            this.setState({
              yourAnimal: true,
            });
          } else if (
            event.data === "close" &&
            this.state.myUserName !== chatUser.clientData
          ) {
            this.setState({
              yourAnimal: false,
            });
          }
        });

        mySession.on("exception", (exception) => {
          console.warn(exception);
        });
        this.getToken().then((token) => {
          mySession
            .connect(token, { clientData: this.state.myUserName })
            .then(() => {
              let publisher = this.OV.initPublisher(undefined, {
                audioSource: undefined, // The source of audio. If undefined default microphone
                videoSource: undefined, // The source of video. If undefined default webcam
                publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true, // Whether you want to start publishing with your video enabled or not
                frameRate: 50, // The frame rate of your video
                insertMode: "APPEND", // How the video is inserted in the target element 'video-container'
                mirror: false, // Whether to mirror your local video or not
              });

              mySession.publish(publisher);

              this.setState({
                mainStreamManager: publisher,
                publisher: publisher,
              });
            })
            .catch((error) => {
              console.log(
                "There was an error connecting to the session:",
                error.code,
                error.message
              );
            });
        });
      }
    );
  }

  leaveSession() {
    Swal.fire({
      title: "화상채팅 종료하시겠습니까 ?",
      showCancelButton: true,
      confirmButtonText: "Yes",
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        const mySession = this.state.session;

        if (mySession) {
          mySession.disconnect();
        }
        // this.OV = null;
        // this.setState({
        //   session: undefined,
        //   subscribers: [],
        //   mainStreamManager: undefined,
        //   publisher: undefined,
        // });
        this.handlereview();
      }
    });
  }
  closeCamera() {
    const session = this.state.session;
    session.signal({
      data: "close", // Any string (optional)
      to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
      type: "my-chat", // The type of message (optional)
      from: this.state.myUserName,
    });
  }

  openCamera() {
    const session = this.state.session;
    session.signal({
      data: "open", // Any string (optional)
      to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
      type: "my-chat", // The type of message (optional)
      from: this.state.myUserName,
    });
  }

  chatting() {
    const session = this.state.session;
    session
      .signal({
        data: "hey", // Any string (optional)
        to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
        type: "my-chat", // The type of message (optional)
        from: this.state.myUserName,
      })
      .then(() => {
        this.setState({
          myAnimal: !this.state.myAnimal,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const mySessionId = this.state.mySessionId;
    const myUserName = this.state.myUserName;

    return (
      <div className="videoChat-container">
        {this.state.session === undefined ? (
          <div id="join">
            <img
              className="videoChat-img"
              src={process.env.PUBLIC_URL + "/Images/logo1.png"}
              alt="OpenVidu logo"
            />
            <div id="join-dialog" className="jumbotron vertical-center">
              <h1> 애블데이 Ready? </h1>

              <video id="video" width="90%" height="400px" autoplay></video>

              <form className="form-group" onSubmit={this.joinSession}>
                <p>{this.state.myUserName}님 안녕하세요!</p>
                <p className="text-center">
                  <input
                    className="btn-rounded videoChat-btn"
                    name="commit"
                    type="submit"
                    value="ENTER!"
                  />
                </p>
              </form>
            </div>
          </div>
        ) : null}

        {this.state.session !== undefined ? (
          <div id="session">
            <div id="session-header">
              <h1 className="web-mode" id="session-title">
                Welcome to 애블데이
              </h1>
              <input
                className="btn-util videoChat-exit-btn web-mode"
                type="button"
                onClick={this.leaveSession}
                value="종료"
              />
            </div>

            <div className="videoChat-frame">
              {this.state.review ? (
                <ReviewPage
                  state={this.state}
                  pairInfo={this.props.roomdata.pairInfo}
                />
              ) : null}

              {this.state.subscribers.map((sub, i) => (
                <div
                  key={i}
                  className="stream-container col-md-6 col-xs-6"
                  onClick={() => this.handleMainVideoStream(sub)}
                >
                  <UserVideoComponent
                    streamManager={sub}
                    myAnimal={this.state.myAnimal}
                    yourAnimal={this.state.yourAnimal}
                    myNickname={this.state.myUserName}
                    pairInfo={this.props.roomdata.pairInfo}
                  />
                </div>
              ))}
              {this.state.publisher !== undefined ? (
                <div
                  className="stream-container col-md-6 col-xs-6"
                  onClick={() =>
                    this.handleMainVideoStream(this.state.publisher)
                  }
                >
                  <UserVideoComponent
                    streamManager={this.state.publisher}
                    myAnimal={this.state.myAnimal}
                    yourAnimal={this.state.yourAnimal}
                    myNickname={this.state.myUserName}
                    pairInfo={this.props.roomdata.pairInfo}
                  />
                </div>
              ) : null}
            </div>
            <div className="videoChat-btnList">
              {this.state.sound ? (
                <button
                  className="btn-util videoChat-btn-util"
                  onClick={() => this.handleCloseSound()}
                >
                  <BsFillVolumeUpFill />
                </button>
              ) : (
                <button
                  className="btn-util videoChat-btn-util"
                  onClick={() => this.handleOpenSound()}
                >
                  <BsFillVolumeMuteFill />
                </button>
              )}

              {this.state.camera ? (
                <button
                  className="btn-util videoChat-btn-util"
                  onClick={() => this.handleCloseCamera()}
                >
                  <RiCameraLine />
                </button>
              ) : (
                <button
                  className="btn-util videoChat-btn-util"
                  onClick={() => this.handleOpenCamera()}
                >
                  <RiCameraOffLine />
                </button>
              )}

              {this.state.animal ? (
                <button
                  className="btn-util videoChat-btn-util"
                  onClick={() => this.handleAnimal()}
                >
                  <GiDominoMask />
                  OFF
                </button>
              ) : (
                <button
                  className="btn-util videoChat-btn-util"
                  onClick={() => this.handleAnimal()}
                >
                  <GiDominoMask />
                  ON
                </button>
              )}

              <button
                className="btn-util videoChat-btn-util"
                onClick={() => this.handleAddFriend()}
              >
                <BsPersonPlus />
              </button>
              <input
                className="btn-util videoChat-exit-btn mobile-mode"
                type="button"
                onClick={this.leaveSession}
                value="종료"
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  getToken() {
    return this.createSession(this.state.mySessionId).then((sessionId) =>
      this.createToken(sessionId)
    );
  }

  createSession(sessionId) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({ customSessionId: sessionId });
      axios
        .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
          headers: {
            Authorization:
              "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log("CREATE SESION", response);
          resolve(response.data.id);
        })
        .catch((response) => {
          var error = Object.assign({}, response);
          if (error?.response?.status === 409) {
            resolve(sessionId);
          } else {
            console.log(error);
            console.warn(
              "No connection to OpenVidu Server. This may be a certificate error at " +
                OPENVIDU_SERVER_URL
            );
            if (
              window.confirm(
                'No connection to OpenVidu Server. This may be a certificate error at "' +
                  OPENVIDU_SERVER_URL +
                  '"\n\nClick OK to navigate and accept it. ' +
                  'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' +
                  OPENVIDU_SERVER_URL +
                  '"'
              )
            ) {
              window.location.assign(
                OPENVIDU_SERVER_URL + "/accept-certificate"
              );
            }
          }
        });
    });
  }

  createToken(sessionId) {
    return new Promise((resolve, reject) => {
      var data = {};
      axios
        .post(
          OPENVIDU_SERVER_URL +
            "/openvidu/api/sessions/" +
            sessionId +
            "/connection",
          data,
          {
            headers: {
              Authorization:
                "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log("TOKEN", response);
          resolve(response.data.token);
        })
        .catch((error) => reject(error));
    });
  }
}

export default VideoChat;
