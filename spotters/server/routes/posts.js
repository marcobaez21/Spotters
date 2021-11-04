import express from "express";
const router = express.Router();
import { search, tenArtistTopTen, top10genre } from "../database.js";
import { insertAndUpdate} from "../database.js";
import { remove } from "../database.js";
import { ImportDB } from "../database.js";
import { ExportDatabase } from "../database.js";
import { averageCharacteristics } from "../database.js";
import { searchAndReturnCharacteristics } from "../database.js";
import { topArtistMostFollowers } from "../database.js";
import {topSongsMostNumber1 } from "../database.js";
import { topArtistsMostNumber1 } from "../database.js";

let songs = [];
let AvgCharacteristics = [];
let CharacteristicsLabels = [];
let SongCharacteristics = [];
let globalaverages = [];
let TopGenres = [];
let Artists = [];
let TopFollowers = [];
let topArtistsMostNum1 = [];
let songsMostNum1 = [];

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
    //AvgCharacteristics = averageCharacteristics();
    //globalaverages = [AvgCharacteristics[0][1],AvgCharacteristics[0][2],AvgCharacteristics[0][3],AvgCharacteristics[0][4],AvgCharacteristics[0][5],AvgCharacteristics[0][6]];
    SongCharacteristics = searchAndReturnCharacteristics(req.body.rank, req.body.country, req.body.date);
});

router.get("/analytics/f1", function(req, res) {
    AvgCharacteristics = averageCharacteristics();
    globalaverages = [AvgCharacteristics[0][1],AvgCharacteristics[0][2],AvgCharacteristics[0][3],AvgCharacteristics[0][4],AvgCharacteristics[0][5],AvgCharacteristics[0][6]];
    res.json({
        labels: CharacteristicsLabels,
        average: globalaverages,
        data: SongCharacteristics
    });
});


router.get("/analytics/f2", function(req, res) {
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

router.get("/analytics/f3", function(req, res) {
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

router.get("/analytics/f4", function(req, res) {
    TopFollowers = topArtistMostFollowers();
    let tempA = [];
    let tempB = [];

    // Put top artists into tempA and count into tempB
    for (let j = 0; j < TopFollowers.length-1; j+=2) {
       // tempA.push([TopFollowers[j][0]]);
      //  tempB.push([TopFollowers[j][1]]);
      tempA.push(TopFollowers[j]);
      tempB.push(TopFollowers[j+1]);
    }
    res.json({ 
        labels: tempA,
        data: tempB
    });

});

router.get("/analytics/f5", function(req, res) {
    songsMostNum1 = topSongsMostNumber1();
    let tempA = [];
    let tempB = [];

    // Put top artists into tempA and count into tempB
    for (let j = 0; j < songsMostNum1.length; j++) {
        tempA.push([songsMostNum1[j][0]]);
        tempB.push([songsMostNum1[j][2]]);
    }
    res.json({ 
        labels: tempA,
        data: tempB
    });

});

router.get("/analytics/f6", function(req, res) {
    topArtistsMostNum1 = topArtistsMostNumber1();
    let tempA = [];
    let tempB = [];

    // Put top artists into tempA and count into tempB
    for (let j = 0; j < topArtistsMostNum1.length; j++) {
        tempA.push([topArtistsMostNum1[j][0]]);
        tempB.push([topArtistsMostNum1[j][1]]);
    }
    res.json({ 
        labels: tempA,
        data: tempB
    });

});


router.post("/analytics/f2", function (req, res) {
    
});

router.post("/analytics/f3", function (req, res) {
    
});

router.post("/analytics/f4", function (req, res) {
    
});
router.post("/analytics/f5", function (req, res) {
    
});
router.post("/analytics/f6", function (req, res) {
    
});

export default router;
