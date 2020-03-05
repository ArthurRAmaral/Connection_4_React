import React, { Component } from "react";
import api from "../services/api";
import io from "socket.io-client";

import socketUrl from "../utils/backendUrl";

import "./Room.css";

import loadGif from "../assets/load.gif";

import markEmpty from "../assets/.png";
import markX from "../assets/x.jpg";
import markO from "../assets/o.jpg";

const stateValue = {
  room: {},
  markers: {
    markEmpty: <img src={markEmpty} className="game-mark e-mark" alt="" />,
    markX: <img src={markX} className="game-mark x-mark" alt="" />,
    markO: <img src={markO} className="game-mark o-mark" alt="" />
  }
};

export default class Room extends Component {
  state = stateValue;

  async componentDidMount() {
    const id = await sessionStorage.getItem("lastRoomId");

    const response = await api.get(`myroom/${id}`);

    const room = response.data;

    // await sessionStorage.setItem("actualRoom", JSON.stringify(saveRoom));

    this.setState({ room: room });
    this.registerToSocket(room._id);
    this.render();
  }

  registerToSocket = id => {
    const socket = io(socketUrl);

    socket.on("play#" + id, newRoom => {
      stateValue.room = newRoom;
      this.setState(stateValue);
    });

    socket.on("joined#" + id, newRoom => {
      stateValue.room = newRoom;
      this.setState(stateValue);
    });

    socket.on("started#" + id, newRoom => {
      stateValue.room = newRoom;
      this.setState(stateValue);
    });

    socket.on("gameover#" + id, newRoom => {
      stateValue.room = newRoom;

      // stateValue.room.status = "3";
      console.log(stateValue);
      this.setState(stateValue);
    });
  };

  async handleStart(id) {
    api.put(`start/${id}`, {
      key: await sessionStorage.getItem("lastKey")
    });
  }

  async postPlay(playColumn) {
    const body = {
      id: this.state.room._id,
      column: playColumn,
      player: await sessionStorage.getItem("nickname")
    };

    const res = await api.post("postplay", body);
    if (res.data.status === 12) alert(res.data.statusMsg);
  }

  async handleRestart(id) {
    await api.put("restart", id);
  }

  renderRoom = () => {
    const room = this.state.room;
    if (room.marks === undefined) return;
    let content = React.createElement("div", { className: "game-table" });
    const isRoomOwner = sessionStorage.getItem("nickname") === room.playerHost;
    const isOfThisRoom =
      isRoomOwner || sessionStorage.getItem("nickname") === room.playerGuest;

    if (room.status === 3) {
      content = React.createElement(
        "div",
        {},
        <div>
          <div id="msg-modal">
            <div id="result-msg">
              <h1>{room.result.win + " won!!!"}</h1>
              <input
                type="button"
                className="restart-btn"
                value="Restart"
                onClick={this.handleRestart}
              />
            </div>
          </div>
          <div className="game-table">
            {room.marks.map((array, indx) => (
              <div className="column">
                {array.map((iten, indxC) => {
                  for (let index = 0; index < room.result.i.length; index++) {
                    if (
                      indx === room.result.i[index] &&
                      indxC === room.result.j[index]
                    ) {
                      let img;
                      if (room.result.win === room.playerHost) {
                        img = markX;
                      } else {
                        img = markX;
                      }

                      return React.createElement("img", {
                        src: img,
                        className: "game-mark x-mark won-mark",
                        alt: ""
                      });
                    }
                  }
                  switch (iten) {
                    case "":
                      return this.state.markers.markEmpty;
                    case "x":
                      return this.state.markers.markX;
                    case "o":
                      return this.state.markers.markO;
                    default:
                      return this.state.markers.markEmpty;
                  }
                })}
              </div>
            ))}
          </div>
        </div>
      );
    } else if (room.status === 2 && isOfThisRoom) {
      content = React.createElement(
        "div",
        {},
        <div className="game-table">
          {room.marks.map((array, indx) => (
            <div className="column using" onClick={() => this.postPlay(indx)}>
              {array.map(iten => {
                switch (iten) {
                  case "":
                    return this.state.markers.markEmpty;
                  case "x":
                    return this.state.markers.markX;
                  case "o":
                    return this.state.markers.markO;
                  default:
                    return this.state.markers.markEmpty;
                }
              })}
            </div>
          ))}
        </div>
      );
    } else if (room.status === 1 && isRoomOwner) {
      content = React.createElement(
        "div",
        {},

        <div className="start-btn" onClick={() => this.handleStart(room._id)}>
          Start
        </div>
      );
    } else if (room.status === 1 && isOfThisRoom) {
      content = React.createElement(
        "div",
        {},

        <div className="await-msg">
          <h1>Wait host start</h1>
          <img src={loadGif} alt="" />
        </div>
      );
    } else if (room.status === 0 && isRoomOwner) {
      content = React.createElement(
        "div",
        {},
        <div className="await-msg">
          <h1>Wait another player!</h1>
          <img src={loadGif} alt="" />
        </div>
      );
    } else console.log(room);

    return content;
  };

  render() {
    return (
      <section id="room">
        <article key={`room#${this.state.room._id}`}>
          {this.renderRoom()}
        </article>
      </section>
    );
  }
}
