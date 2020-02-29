import React from "react";
import { Link } from "react-router-dom";

import "./Header.css";

import logo from "../assets/logo.png";
import camera from "../assets/camera2.png";

export default function Header() {
  return (
    <header id="main-header">
      <div className="header-content">
        <Link to="/">
          <img src={logo} alt="AAAGram Logo" id="logo" />
        </Link>
        <Link to="/new">
          <img src={camera} alt="Enviar publicação" id="camera" />
        </Link>
      </div>
    </header>
  );
}
