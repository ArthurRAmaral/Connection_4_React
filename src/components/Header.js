import React from "react";
import { Link } from "react-router-dom";

import "./Header.css";

import logo from "../assets/logo.jpg";
import meetRoom from "../assets/meeting_room-24px.svg";
import editNick from "../assets/create-24px.svg";

export default function Header() {
  return (
    <header id="main-header">
      <div className="header-content">
        <Link to="/feed">
          <img src={logo} alt="AAAGram Logo" id="logo" />
        </Link>
        <Link to="/create" id="newBtn">
          <h1>New room</h1>
          <img src={meetRoom} alt="Create new room" id="meetRoom" />
        </Link>
        <Link to="/" id="editNickBtn">
          <h1 id="nickname">Nickname</h1>
          <img src={editNick} alt="Edit nickname" id="editNick" />
        </Link>
        <h1 id="nickname">{sessionStorage.getItem("nickname")}</h1>
      </div>
    </header>
  );
}
