import express from "express";
const router = express.Router();
import { search } from "../database.js";

<<<<<<< HEAD
let songs = [];
=======
import { parseDict } from "../logic";
import { parseBigData} from "../logic";

let dict = parseDict("dict_10countries_2019.csv");
let data = parseBigData("data_10countries_2019.csv");

let songs = [
    {
        rank: 1,
        country: "where",
        date: "when",
        song_artist: "who",
        song_title: "what"
    }];
>>>>>>> 727bc76723640bc659920f9be0e3e6544da643b1

//Responds to a get request from the front-end coming from /explore
router.route("/explore").get(function (req, res) {
    res.json(songs);
});

//Responds to a post request from the front-end coming from /explore
router.route("/explore").post(function (req, res) {
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

export default router;
