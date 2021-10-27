import React from "react";
import { Route } from "react-router-dom";

import Explore from "./components/explore.js";
import Navbar from "./components/navbar.js";
import Create from "./components/create.js";
import Edit from "./components/edit.js";
import Delete from "./components/delete.js";
import Analytics from "./components/analytics.js";

const App = () => {
    return (
        <div>
            <Navbar />
            <Route exact path="/">
                <Analytics />
            </Route>
            <Route path="/explore">
                <Explore />
            </Route>
            <Route path="/create">
                <Create />
            </Route>
            <Route path="/edit">
                <Edit />
            </Route>
            <Route path="/delete">
                <Delete />
            </Route>
        </div>
    );
};

export default App;
