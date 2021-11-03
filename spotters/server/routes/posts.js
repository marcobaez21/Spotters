import express from "express";
const router = express.Router();
import { search } from "../database.js";
import { insertAndUpdate} from "../database.js";
import { remove } from "../database.js";
import { ImportDB } from "../database.js";
import { ExportDatabase } from "../database.js";
import { averageCharacteristics } from "../database.js";
import { searchAndReturnCharacteristics } from "../database.js";
import { tenArtistTopTen } from "../database.js"
import {top10genre} from "../database.js"

let songs = [];
let AvgCharacteristics = [];
let CharacteristicsLabels = [];
let SongCharacteristics = [];
let globalaverages = [];
let TopGenres = [];
let Artists = [];

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

router.post("/analytics/f1", function(req, res) {
    console.log("in f1 post");
    CharacteristicsLabels = ["average danceability", "average energy", "average speechiness", "average acoustics", "average liveliness", "average valence"];
    AvgCharacteristics = averageCharacteristics();
 //   console.log(AvgCharacteristics);
   // globalaverages = [AvgCharacteristics[0][1],AvgCharacteristics[0][2],AvgCharacteristics[0][3],AvgCharacteristics[0][4],AvgCharacteristics[0][5],AvgCharacteristics[0][6]];
   //console.log(typeof(req.body.rank));
    SongCharacteristics = searchAndReturnCharacteristics(req.body.rank, req.body.country, req.body.date);
   // console.log(SongCharacteristics);
});

router.get("/analytics/f1", function(req, res) {
    AvgCharacteristics = averageCharacteristics();
    //console.log(AvgCharacteristics);
    let globalaverages = [AvgCharacteristics[0][1],AvgCharacteristics[0][2],AvgCharacteristics[0][3],AvgCharacteristics[0][4],AvgCharacteristics[0][5],AvgCharacteristics[0][6]];
       // let globalaverages = [-2, -3, -4, -5, -6, 7];
       // res.json(CharacteristicsLabels, globalaverages, SongCharacteristics);
       res.json({
        labels: CharacteristicsLabels,
        average: globalaverages,
        data: SongCharacteristics
    });
   // res.json(CharacteristicsLabels);
    //res.json(globalaverages);
    //res.json(SongCharacteristics);

});


router.get("/analytics/f2", function (req, res) {
    TopGenres = top10genre();
    let tempA = [];
    let tempB = [];

    // Put genres into tempA and count into tempB
    for (let j = 0; j < TopGenres.length; j++) {
        tempA.push([TopGenres[j][0]]);
        tempB.push([TopGenres[j][1]]);
    }

    res.json({ 
        labels: tempA,
        data: tempB
    });
});

router.get("/analytics/f3", function (req, res) {
    Artists = tenArtistTopTen();
    let tempA = [];
    let tempB = [];

    // Put top artists into tempA and count into tempB
    for (let j = 0; j < Artists.length; j++) {
        tempA.push([Artists[j][0]]);
        tempB.push([Artists[j][1]]);
    }
      
    res.json({ 
        labels: tempA,
        data: tempB
    });
});

export default router;     