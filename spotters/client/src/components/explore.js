import React, { Component } from 'react';
import axios from 'axios';

export default class Explore extends Component {
    constructor(props) {
        super(props);

        this.onChangeRank = this.onChangeRank.bind(this);
        this.onChangeCountry = this.onChangeCountry.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangeSongArtist = this.onChangeSongArtist.bind(this);
        this.onChangeSongTitle = this.onChangeSongTitle.bind(this);
        this.onSearch = this.onSearch.bind(this);

        this.state = {
            rank: "",
            country: "Global",
            date: "2019-01-01",
            song_artist: "",
            song_title: "",
        };
    };

    onChangeRank(e) {
        this.setState({
            rank: e.target.value,
        });
    };

    onChangeCountry(e) {
        this.setState({
            country: e.target.value,
        });
    };

    onChangeDate(e) {
        this.setState({
            date: e.target.value,
        });
    };

    onChangeSongArtist(e) {
        this.setState({
            song_artist: e.target.value,
        });
    };

    onChangeSongTitle(e) {
        this.setState({
            song_title: e.target.value,
        });
    };

    onSearch(e) {
        e.preventDefault();

        const newSearch = {
            rank: this.state.rank,
            country: this.state.country,
            date: this.state.date,
            song_artist: this.state.song_artist,
            song_title: this.state.song_title,
        };

        axios
            .post("http://localhost:5000/posts/explore", newSearch);

        this.setState({
            rank: "",
            country: "Global",
            date: "2019-01-01",
            song_artist: "",
            song_title: "",
        });
    };

    render() {
        return (
            <div>
                <form onSubmit={this.onSearch}>
                    <table style={{ marginLeft: 20 }}>
                        <thead>
                            <tr>
                                <td style={{ padding: 10, width: 100 }}>
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
                                <td style={{ padding: 10, width: 190 }}>
                                    <select
                                        value={this.state.country}
                                        onChange={this.onChangeCountry}
                                        style={{ width: 190 }}>
                                        <option value="Global" selected>Global</option>
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
                                <td style={{ padding: 10, width: 190 }}>
                                    <input
                                        type="date"
                                        className="form-control"
                                        min="2019-01-01"
                                        max="2019-12-31"
                                        value={this.state.date}
                                        onChange={this.onChangeDate}
                                    />
                                </td>
                                <td style={{ padding: 10, width: 400 }}>
                                    <input
                                        type="text"
                                        placeholder="Artist"
                                        className="form-control"
                                        value={this.state.song_artist}
                                        onChange={this.onChangeSongArtist}
                                    />
                                </td>
                                <td style={{ padding: 10, width: 400 }}>
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        className="form-control"
                                        value={this.state.song_title}
                                        onChange={this.onChangeSongTitle}
                                    />
                                </td>
                                <td style={{ padding: 10, width: 100 }}>
                                    <input
                                        type="submit"
                                        value="Search"
                                        className="btn btn-primary"
                                    />
                                </td>
                            </tr>
                        </thead>
                    </table>
                </form>
            </div>
        );
    };
};