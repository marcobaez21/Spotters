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

router.route("/explore").get(function (req, res) {
    res.json(songs);
});

router.route("/explore").post(function (req, res) {
    songs.push({ message: req.body.message });
});

export default router;
