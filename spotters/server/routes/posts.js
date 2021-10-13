import express from "express";
const router = express.Router();

let songs = [
    {
        rank: 1,
        country: "where",
        date: "when",
        song_artist: "who",
        song_title: "what"
    },
    {
        rank: 1,
        country: "where",
        date: "when",
        song_artist: "who",
        song_title: "what"
    }];

//Responds to a get request from the front-end coming from /explore
router.route("/explore").get(function (req, res) {
    res.json(songs);
});

//Responds to a post request from the front-end coming from /explore
router.route("/explore").post(function (req, res) {
    const newSearch = {
        rank: req.body.rank,
        country: req.body.country,
        date: req.body.date,
        song_artist: req.body.song_artist,
        song_title: req.body.song_title,
    };
    songs.push(newSearch);
});

export default router;
