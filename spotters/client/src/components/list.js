import React, { Component } from 'react';

const Song = (props) => (
    <tr>
        <td>{props.song.rank}</td>
        <td>{props.song.country}</td>
        <td>{props.song.date}</td>
        <td>{props.song.song_artist}</td>
        <td>{props.song.song_title}</td>
    </tr>
);

export default class List extends Component {
    constructor(props) {
        super(props);

        this.state = {
            songs: [],
        };
    };

    componentDidMount() {
        fetch('http://localhost:5000/posts/explore')
            .then(res => res.json())
            .then(songs => this.setState({ songs }));
    };

    songList() {
        return this.state.songs.map((currentSong) => {
            return (
                <Song
                    song={currentSong}
                />
            );
        });
    }

    render() {
        return (
            <div>
                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <tbody>{this.songList()}</tbody>
                </table>
            </div>
        );
    };
};
