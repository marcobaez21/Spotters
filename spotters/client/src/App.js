import React from "react";
import { Route } from "react-router-dom";

import Explore from "./components/explore.js";
import List from "./components/list.js";
import Navbar from "./components/navbar.js";

const App = () => {
    return (
        <div>
            <Navbar />
            <Route path="/explore">
                <Explore />
                <List />
            </Route>
        </div>
    );
};

export default App;
