import React, { Component } from 'react';

const Song = (props) => (
    <tr>
        <td style={{ padding: 10, width: 100 }}>{props.song.rank}</td>
        <td style={{ padding: 10, width: 200 }}>{props.song.country}</td>
        <td style={{ padding: 10, width: 200 }}>{props.song.date}</td>
        <td style={{ padding: 10, width: 400 }}>{props.song.song_artist}</td>
        <td style={{ padding: 10, width: 400 }}>{props.song.song_title}</td>
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
                <table className="table table-striped" style={{ marginTop: 20, marginLeft: 20, width: 1300 }}>
                    <tbody>{this.songList()}</tbody>
                </table>
            </div>
        );
    };
};
