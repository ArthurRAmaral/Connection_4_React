import React, { Component } from "react";
import api from "../services/api";
import io from "socket.io-client";

import "./Feed.css";

import socketUrl from "../utils/backendUrl";

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
    const socket = io(socketUrl);

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
        sessionStorage.setItem("lastKey", key);
        sessionStorage.setItem("lastRoomId", room._id);
        this.props.history.push("/room");
        break;
      default:
        console.error(res);
        alert(msg);
        break;
    }
  }

  render() {
    return (
      <section id="room-list">
        {this.state.feed.map(room => (
          <article key={room._id}>
            <header>
              <div className="room-info">
                <span>
                  <span className="fix room-name">Room: </span>
                  <span className="room-name">{room.roomName}</span>
                </span>
                <span>
                  <span className="fix owner">Owner: </span>
                  <span className="owner">{room.playerHost}</span>
                </span>
              </div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const keyInpt = document.getElementById(`input${room._id}`)
                    .value;
                  this.handleJoin(room, keyInpt);
                }}
              >
                <input
                  type="password"
                  placeholder="Password"
                  id={`input${room._id}`}
                />
                <input type="submit" value="Join" />
              </form>
            </header>
          </article>
        ))}
      </section>
    );
  }
}
