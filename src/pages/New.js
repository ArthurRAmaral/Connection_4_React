import React, { Component } from "react";
import api from "../services/api";

import "./New.css";

class New extends Component {
  state = {
    roomName: "",
    playerHost: "",
    key: "",
    vkey: ""
  };

  handleSubmit = async e => {
    e.preventDefault()();
    const { vkey, key, roomName } = this.state;
    if (vkey === key && roomName.length >= 3 && roomName.length <= 15) {
      this.state.playerHost = sessionStorage.getItem("nickname");

      const roomCreated = api.post("createroom", {
        roomName: roomName,
        key: key,
        playerHost: this.state.playerHost
      });
      if (roomCreated.data._id !== undefined) {
        sessionStorage.setItem("lastKey", key);
        sessionStorage.setItem("lastRoomId", roomCreated.data._id);

        this.props.history.push("/room");
      } else {
        alert(roomCreated.data.statusMsg);
      }
    } else if (vkey !== key) {
      alert("Repeat the fist password correctly");
    }
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <form id="new-room" onSubmit={this.handleSubmit}>
        <input
          type="text"
          name="roomName"
          placeholder="Room name"
          maxLength="15"
          minLength="3"
          onChange={this.handleChange}
          value={this.state.roomName}
          required
        />

        <input
          type="password"
          name="key"
          maxLength="15"
          minLength="3"
          placeholder="Choose a password"
          onChange={this.handleChange}
          value={this.state.key}
        />

        <input
          type="password"
          name="vkey"
          maxLength="15"
          minLength="3"
          placeholder="Repeat the password"
          onChange={this.handleChange}
          value={this.state.vkey}
        />

        <input type="submit" value="Create" />
      </form>
    );
  }
}

export default New;
