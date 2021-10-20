import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import axios from 'axios';
import { NavLink } from "react-router-dom";

export default class Navbar extends Component {
    constructor(props) {
        super(props);

        this.onImport = this.onImport.bind(this);
        this.onBackup = this.onBackup.bind(this);
    };

    onImport(e) {
        axios
            .post("http://localhost:5000/posts/import");

        alert("Data imported");
    }

    onBackup(e) {
        axios
            .post("http://localhost:5000/posts/backup");

        alert("Data backuped");
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <NavLink className="navbar-brand" to="/" style={{ marginLeft: 10, color: "#1DB954" }}>
                        Spotters
                    </NavLink>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-toggle="collapse"
                        data-target="#navbarSupportedContent"
                        aria-controls="navbarSupportedContent"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="nav navbar-nav">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/explore">
                                    Explore
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/create">
                                    Create
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/edit">
                                    Edit
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/delete">
                                    Delete
                                </NavLink>
                            </li>
                        </ul>
                        <form class="form-inline" onSubmit={this.onImport}>
                            <button class="btn btn-light" type="submit">Import</button>
                        </form>
                        <form class="form-inline" onSubmit={this.onBackup}>
                            <button class="btn btn-light" type="submit">Backup</button>
                        </form>
                    </div>
                </nav>
            </div >
        );
    };
};
