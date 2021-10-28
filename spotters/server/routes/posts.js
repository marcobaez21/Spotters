import express from "express";
const router = express.Router();
import { search } from "../database.js";
import { insertAndUpdate} from "../database.js";
import { remove } from "../database.js";
import { ImportDB } from "../database.js";
import { ExportDatabase } from "../database.js";
import { averageCharacteristics } from "../database.js";
import { searchAndReturnCharacteristics } from "../database.js";

let songs = [];
let AvgCharacteristics = [];
let CharacteristicsLabels = [];
let SongCharacteristics = [];

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

router.get("http://localhost:5000/posts/analytics/f1", function(req, res) {
    let globalaverages = [AvgCharacteristics[0][1],AvgCharacteristics[0][2],AvgCharacteristics[0][3],AvgCharacteristics[0][4],AvgCharacteristics[0][5],AvgCharacteristics[0][6]];
    res.json(CharacteristicsLabels, globalaverages, SongCharacteristics);
});

router.post("http://localhost:5000/posts/analytics/f1", function(req, res) {
    CharacteristicsLabels = ["average danceability", "average energy", "average speechiness", "average acoustics", "average liveliness", "total number of songs", "average valence"];
    AvgCharacteristics = averageCharacteristics();
    SongCharacteristics = searchAndReturnCharacteristics(req.body.rankF1, req.body.countryF1, req.body.dateF1);
});

router.post("http://localhost:5000/posts/analytics/f2", function (req, res) {

});

router.post("http://localhost:5000/posts/analytics/f3", function (req, res) {

});

export default router;
