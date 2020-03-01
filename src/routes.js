import React from "react";
import { Switch, Route } from "react-router-dom";

import Feed from "./pages/Feed";
import New from "./pages/New";
import NickSet from "./pages/NickSet";

function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={NickSet} />
      <Route path="/feed" exact component={Feed} />
      <Route path="/create" component={New} />
    </Switch>
  );
}

export default Routes;
