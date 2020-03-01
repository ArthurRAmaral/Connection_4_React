import React, { Component } from "react";

import "./NickSet.css";

export default class NickSet extends Component {
  state = {
    nickname: ""
  };

  handleSubmit = e => {
    const nickSize = this.state.nickname.length;
    if (nickSize >= 3 && nickSize <= 15) {
      sessionStorage.setItem("nickname", this.state.nickname);
      this.props.history.push("/feed");
    }
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <section id="nick-set">
        <form
          onSubmit={e => {
            e.preventDefault();
            this.handleSubmit();
          }}
        >
          <input
            type="text"
            name="nickname"
            placeholder="Nickname"
            maxLength="15"
            minLength="3"
            onChange={this.handleChange}
            value={this.state.nickname}
            required
          />
          <input type="submit" value="Set nickname" />
        </form>
      </section>
    );
  }
}
