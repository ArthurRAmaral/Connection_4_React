import React, { Component } from "react";
import api from "../services/api";
import io from "socket.io-client";

import "./Room.css";

export default class Room extends Component {
  state = {
    room: {}
  };

  async componentDidMount() {
    const id = await sessionStorage.getItem("lastRoomId");

    const response = await api.get(`myroom/${id}`);

    const room = response.data;

    // await sessionStorage.setItem("actualRoom", JSON.stringify(saveRoom));

    this.setState({ room: room });
    this.registerToSocket(room._id);
  }

  registerToSocket = id => {
    const socket = io("http://localhost:3333");

    socket.on("play#" + id, newPlay => {
      this.setState({ room: { marks: newPlay, ...this.state.room } });
    });
  };

  async handleJoin(room, key) {
    const res = await api.put(`join/${room._id}`, {
      key: key,
      playerGuest: await sessionStorage.getItem("nickname")
    });
    const status = res.data.status;
    const msg = res.data.statusMsg;
    switch (status) {
      case 0:
        //Join
        alert(msg);
        sessionStorage.setItem("lastKey", key);
        sessionStorage.setItem("lastRoomId", room._id);
        this.props.history.push("/room");
        break;
      default:
        alert(msg);
        break;
    }
  }

  render() {
    return (
      <section id="room-list">
        <article key={this.state.room._id}>
          {this.state.room.marks.map(array => {
            array.map(iten => {
              switch (iten) {
                case "":
                  return <img src="" />;
                  break;
                case "x":
                  break;
                case "o":
                  break;
                default:
                  break;
              }
            });
          })}
          <div>
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
          <div>
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
          <div>
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
          <div>
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
          <div>
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
          <div>
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
          <div>
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
            <img src="" alt="" />
          </div>
        </article>
      </section>
    );
  }
}
