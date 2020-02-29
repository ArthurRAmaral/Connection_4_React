import React, { Component } from "react";
import api from "../services/api";
import io from "socket.io-client";

import "./Feed.css";

export default class Feed extends Component {
  state = {
    feed: []
  };
  async componentDidMount() {
    this.registerToSocket();

    const response = await api.get("allopenrooms");

    this.setState({ feed: response.data });
  }

  registerToSocket = () => {
    const socket = io("http://localhost:3333");

    socket.on("newRoom", newRoom => {
      this.setState({ feed: [newRoom, ...this.state.feed] });
    });

    socket.on("finished", finishedRoom => {
      this.setState({
        feed: this.state.feed.filter(room => room._id !== finishedRoom._id)
      });
    });

    socket.on("joined", joinedRoom => {
      this.setState({
        feed: this.state.feed.filter(room => room._id !== joinedRoom._id)
      });
    });
  };

  async handleJoin(room) {
    const res = await api.put(`join/${room._id}`, {});
    const status = res.data.status;
    const msg = res.data.statusMsg;
    console.log(res.data);
    switch (status) {
      case 0:
        alert(msg);
        break;
      case 1:
        alert(msg);
        break;
      case 3:
        alert(msg);
        break;
      default:
        break;
    }
  }

  async handleBtnClick(id) {
    // document.getElementById("log-painel").innerHTML=
    // <input type="text" placeholder="Nickname" id="nickname" />
    // <input type="text" placeholder="Key" id="key" />
    // <button onClick={() => this.handleBtnClick(room._id)}>Join</button>
  }

  render() {
    return (
      <section id="room-list">
        <div id="log-painel"></div>
        {this.state.feed.map(room => (
          <article key={room._id}>
            <header>
              <div className="room-info">
                <span>{room.roomName}</span>
                <br />
                <span className="place">{room.playerHost}</span>
                <button onClick={() => this.handleJoin(room)}>Join</button>
              </div>
            </header>
            <br />
            <br />
          </article>
        ))}
      </section>
    );
  }
}
