import React, { Component } from "react";
import api from "../services/api";
import io from "socket.io-client";

import "./Room.css";
import markEmpty from "../assets/.png";
import markX from "../assets/x.png";
import markO from "../assets/o.png";

import loadGif from "../assets/load.gif";

export default class Room extends Component {
  state = {
    room: {},
    markers: {
      markEmpty: <img src={markEmpty} className="game-mark e-mark" alt="" />,
      markX: <img src={markX} className="game-mark x-mark" alt="" />,
      markO: <img src={markO} className="game-mark o-mark" alt="" />
    }
  };

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
    const socket = io("http://localhost:3333");

    socket.on("play#" + id, newRoom => {
      this.setState({
        room: newRoom,
        markers: {
          markEmpty: (
            <img src={markEmpty} className="game-mark e-mark" alt="" />
          ),
          markX: <img src={markX} className="game-mark x-mark" alt="" />,
          markO: <img src={markO} className="game-mark o-mark" alt="" />
        }
      });
    });

    socket.on("joined#" + id, newRoom => {
      this.setState({
        room: newRoom,
        markers: {
          markEmpty: (
            <img src={markEmpty} className="game-mark e-mark" alt="" />
          ),
          markX: <img src={markX} className="game-mark x-mark" alt="" />,
          markO: <img src={markO} className="game-mark o-mark" alt="" />
        }
      });
    });

    socket.on("started#" + id, newRoom => {
      this.setState({
        room: newRoom,
        markers: {
          markEmpty: (
            <img src={markEmpty} className="game-mark e-mark" alt="" />
          ),
          markX: <img src={markX} className="game-mark x-mark" alt="" />,
          markO: <img src={markO} className="game-mark o-mark" alt="" />
        }
      });
    });

    socket.on("gameover", result => {});
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

    await api.post("postplay", body);
  }

  renderRoom = () => {
    if (this.state.room.marks === undefined) return;
    let content = React.createElement("div", { className: "game-table" });
    const isRoomOwner =
      sessionStorage.getItem("nickname") === this.state.room.playerHost;
    const isOfThisRoom =
      isRoomOwner ||
      sessionStorage.getItem("nickname") === this.state.room.playerGuest;
    if (this.state.room.status >= 2 && isOfThisRoom) {
      content = React.createElement(
        "div",
        { className: "game-table" },

        this.state.room.marks.map((array, indx) => (
          <div
            className="column"
            onClick={async () => await this.postPlay(indx)}
          >
            {array.map(iten => {
              // <img src={`${iten}.jpg`} alt="" />
              // <img src={markTest} alt="" />

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
        ))
      );
    } else if (this.state.room.status === "1" && isRoomOwner) {
      content = React.createElement(
        "div",
        { className: "game-table" },

        <div
          className="start-btn"
          onClick={() => this.handleStart(this.state.room._id)}
        >
          Start
        </div>
      );
    } else if (this.state.room.status === "1" && isOfThisRoom) {
      content = React.createElement(
        "div",
        { className: "game-table" },

        <div className="await-msg">
          <h1>Wait host start</h1>
          <img src={loadGif} alt="" />
        </div>
      );
    } else if (this.state.room.status === "0" && isRoomOwner) {
      content = React.createElement(
        "div",
        { className: "game-table" },
        <div className="await-msg">
          <h1>Wait another player!</h1>
          <img src={loadGif} alt="" />
        </div>
      );
    } else console.log(this.state.room);

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
