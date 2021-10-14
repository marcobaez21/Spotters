import express from "express";
import { parseData } from "../logic.js";
const router = express.Router();

import {parseDict} from './logic.js';
import {parseData} from './logic.js';

let dict = parseDict("insertfilename");
let data = parseData("insertfilename");

let songs = [
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
        rank: (req.body.rank == "") ? 0 : req.body.rank,
        country: req.body.country,
        date: (req.body.date == "") ? "2019-01-01" : req.body.date,
        song_artist: req.body.song_artist,
        song_title: req.body.song_title,
    };
    songs.push(newSearch);
});

export default router;
