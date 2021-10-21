import express from "express";
const router = express.Router();
import { search } from "../database.js";
import { insertAndUpdate} from "../database.js";
import { remove } from "../database.js";
import { ImportDB } from "../database.js";
import { ExportDatabase } from "../database.js";

let songs = [];

//Responds to a get request from the front-end coming from /explore
router.get("/explore", function (req, res) {
    res.json(songs);
});

//Responds to a post request from the front-end coming from /explore
router.post("/explore", function (req, res) {
    songs = search(req.body.rank,
        req.body.country,
        req.body.date,
        req.body.song_artist,
        req.body.song_title);

    if (songs.length == 0) //No matches
        songs.push({
            rank: "",
            country: "",
            date: "",
            song_artist: "no matches",
            song_title: ""
        });
});

router.post("/create", function (req, res) {
    insertAndUpdate(req.body.rank,
    req.body.country, 
    req.body.date,
    req.body.song_artist,
    req.body.song_title);
});

router.post("/edit", function (req, res) {
    insertAndUpdate(req.body.rank,
        req.body.country, 
        req.body.date,
        req.body.song_artist,
        req.body.song_title);
});

router.post("/delete", function (req, res) {
    remove(req.body.rank,
        req.body.country, 
        req.body.date,
        req.body.song_artist,
        req.body.song_title);
});

router.post("/import", function (req, res) {
    console.log("Will begin importing!");
    ImportDB();
});

router.post("/backup", function(req, res) {
    console.log("Will begin exporting!");
    ExportDatabase();
});

export default router;
