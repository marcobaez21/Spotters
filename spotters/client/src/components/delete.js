import React, { Component } from "react";
import axios from "axios";
import "./styles.css";

export default class Delete extends Component {
  constructor(props) {
    super(props);

    this.onChangeRank = this.onChangeRank.bind(this);
    this.onChangeCountry = this.onChangeCountry.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeSongArtist = this.onChangeSongArtist.bind(this);
    this.onChangeSongTitle = this.onChangeSongTitle.bind(this);
    this.onDelete = this.onDelete.bind(this);

    this.state = {
      rank: "",
      country: "Global",
      date: "",
      song_artist: "",
      song_title: "",
    };
  }

  onChangeRank(e) {
    this.setState({
      rank: e.target.value,
    });
  }

  onChangeCountry(e) {
    this.setState({
      country: e.target.value,
    });
  }

  onChangeDate(e) {
    this.setState({
      date: e.target.value,
    });
  }

  onChangeSongArtist(e) {
    this.setState({
      song_artist: e.target.value,
    });
  }

  onChangeSongTitle(e) {
    this.setState({
      song_title: e.target.value,
    });
  }

  onDelete(e) {
    if (
      this.state.rank === "" ||
      this.state.date === "" ||
      this.state.song_artist === "" ||
      this.state.song_title === ""
    ) {
      alert("Error: please fill out all fields.");
    } else {
      const newRecord = {
        rank: this.state.rank,
        country: this.state.country,
        date: this.state.date,
        song_artist: this.state.song_artist,
        song_title: this.state.song_title,
      };

      axios.post("http://localhost:5000/posts/delete", newRecord);

      this.setState({
        rank: "",
        country: "Global",
        date: "",
        song_artist: "",
        song_title: "",
      });

      alert("Data successfully deleted.");
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onDelete}>
          <table className="inputTable">
            <thead>
              <tr>
                <td className="tableCell__rank__input">
                  <input
                    type="number"
                    placeholder="Rank"
                    className="form-control"
                    min="1"
                    max="200"
                    value={this.state.rank}
                    onChange={this.onChangeRank}
                  />
                </td>
                <td className="tableCell__country__input">
                  <select
                    className="country__input"
                    value={this.state.country}
                    onChange={this.onChangeCountry}
                    defaultValue="Global"
                  >
                    <option value="Global">Global</option>
                    <option value="Australia">Australia</option>
                    <option value="Canada">Canada</option>
                    <option value="France">France</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Sweden">Sweden</option>
                    <option value="UK">UK</option>
                    <option value="USA">USA</option>
                  </select>
                </td>
                <td className="tableCell__date__input">
                  <input
                    type="date"
                    className="form-control"
                    value={this.state.date}
                    onChange={this.onChangeDate}
                  />
                </td>
                <td className="tableCell__songInfo__input">
                  <input
                    type="text"
                    placeholder="Artist"
                    className="form-control"
                    value={this.state.song_artist}
                    onChange={this.onChangeSongArtist}
                  />
                </td>
                <td className="tableCell__songInfo__input">
                  <input
                    type="text"
                    placeholder="Title"
                    className="form-control"
                    value={this.state.song_title}
                    onChange={this.onChangeSongTitle}
                  />
                </td>
                <td className="tableCell__input">
                  <input
                    type="submit"
                    value="Delete"
                    className="btn btn-primary"
                  />
                </td>
              </tr>
            </thead>
          </table>
        </form>
      </div>
    );
  }
}
