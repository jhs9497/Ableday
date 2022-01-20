import React, { Component } from "react";
import OpenViduVideoComponent from "./OvVideo";
import "./UserVideo.css";

export default class UserVideoComponent extends Component {
  getNicknameTag() {
    // Gets the nickName of the user
    return JSON.parse(this.props.streamManager.stream.connection.data)
      .clientData;
  }

  render() {
    return (
      <div>
        {this.props.streamManager !== undefined ? (
          <div className="streamcomponent">
            <OpenViduVideoComponent
              streamManager={this.props.streamManager}
              sessionNickname={this.getNicknameTag()}
              myAnimal={this.props.myAnimal}
              yourAnimal={this.props.yourAnimal}
              myNickname={this.props.myNickname}
              pairInfo={this.props.pairInfo}
            />
            <div></div>
          </div>
        ) : null}
      </div>
    );
  }
}
