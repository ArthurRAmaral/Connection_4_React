import React from "react";
import { BrowserRouter } from "react-router-dom";

import Headers from "./components/Header";
import Routes from "./routes";

function App() {
  return (
    <BrowserRouter>
      <Headers />
      <Routes />
    </BrowserRouter>
  );
}

export default App;
