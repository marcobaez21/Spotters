import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import { NavLink } from "react-router-dom";
import "./styles.css";

export default class Navbar extends Component {
  constructor(props) {
    super(props);

    this.onImport = this.onImport.bind(this);
    this.onBackup = this.onBackup.bind(this);
  }

  onImport(e) {
    axios.post("http://localhost:5000/posts/import");

    alert("Data imported");
  }

  onBackup(e) {
    axios.post("http://localhost:5000/posts/backup");

    alert("Data backuped");
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between">
          <NavLink id="navBrand" className="navbar-brand ms-3" to="/">
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

          <div
            className="collapse navbar-collapse d-inline-flex justify-content-between"
            id="navbarSupportedContent"
          >
            <ul class="navbar-nav">
              <li className="nav-item p-1">
                <NavLink className="nav-link" to="/explore">
                  Explore
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink className="nav-link" to="/create">
                  Create
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink className="nav-link" to="/edit">
                  Edit
                </NavLink>
              </li>
              <li className="nav-item p-1">
                <NavLink className="nav-link" to="/delete">
                  Delete
                </NavLink>
              </li>
            </ul>
            <ul class="navbar-nav">
              <form class="form-inline p-1" onSubmit={this.onImport}>
                <button class="btn btn-dark btn-outline-light" type="submit">
                  Import
                </button>
              </form>
              <form class="form-inline p-1" onSubmit={this.onBackup}>
                <button class="btn btn-dark btn-outline-light" type="submit">
                  Backup
                </button>
              </form>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
