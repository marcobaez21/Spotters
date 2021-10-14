//const fs = require('fs');
//import {fs} from 'fs';
import fs from "fs";

 export async function parseBigData(filename){ //run this after parseDict()
    if(!fileName)
        return Promise.reject("no file name");

    const fileContent = fs.readFileSync(fileName, "utf8");
    //const fileContent = fs.readFileSync("spotters/server/routes/", "utf8");
    if(!fileContent)
        return Promise.reject("empty file");

    let locations = []; //return this
    const lines = data.split("\n"); //splits the whole file into array of each row

    let [currLoc, currDate] = lines[1].split(",", 2); //keeps track of current location and date

    let dates = [];
    let positions = [];

    for(let i = 1; i < lines.length && lines[i].length > 2; ++i){ //row 0 skipped because keys
        const [location, date, position, id] = lines[i].split(",");
        if(currLoc != location || currDate != date){ //new location or date
            if(currLoc != location){ //push date array into location array
                dates.push(positions);
                positions = [];
                locations.push(dates);
                dates = [];
                currLoc = location; //update current location tracker
            }
            else if(currDate != date){ //push positions array into date array
                dates.push(positions);
                positions = [];
                currDate = date; //update current date tracker
            }
            else
                console.log("error with parseData"); //innit bruv
        }
        positions.push(parseInt(id)); //REMEMBER TO - 1 WHEN INDEXING POSITION ARRAY FOR ID!!!
    }
    dates.push(positions);
    locations.push(dates);

    return Promise.resolve(locations);
}

export async function parseDict(fileName){ //run this before parseData()
    if(!fileName)
        return Promise.reject("no file name");

    const fileContent = fs.readFileSync(fileName, "utf8");

    if(!fileContent)
        return Promise.reject("empty file");

    let out = []; //return this
    const lines = data.split("\n"); //splits the whole file into array of each row

    for(let i = 1; i < lines.length && lines[i].length > 2; ++i){ // > 2 because empty line at the end
        out.push(lines[i].split(",")); //builds the matrix
        out[out.length - 1] = out[out.length - 1].toLowerCase();
    }

    return Promise.resolve(out);
}

//module.exports = {
  //  parseDict: parseDict,
   // parseBigData: parseBigData
//};

async function verify(flag, songName, artistName, dict){ //returns true if input exists
    //flags:    
    //  0 - just song
    //  1 - just artist
    //  2 - both
    const song = songName.toLowerCase();
    const artist = artistName.toLowerCase();
    if(flag == 0){
        for(let i = 0; i < dict.length; ++i){
            if(dict[i][2] == song)
                return true;
        }
    }
    else if(flag == 1){
        for(let i = 0; i < dict.length; ++i){
            if(dict[i][3] == artist)
                return true;
        }
    }
    else{
        for(let i = 0; i < dict.length; ++i){
            if(dict[i][2] == song && dict[i][3] == artist)
                return true;
        }
    }
    return false;
}


async function convertdate(date1){ //takes date which is a string written as 2000-01-01 and turns it into three ints (year, month, day) and then takes that and turns it into one final date int which is 1-365
    var year = parseInt(date1.substring(0, 3));  //the substring of 0-3 is the 2001 in the date1 representing the year i take that substring and convert it into int using parseint
    var month = parseInt(date1.substring(5, 6));  //the substring of 5-6 is the 01 in the date1 representing the month i take that substring and convert it into int using parseint
    var day = parseInt(date1.substring(8, 9));  //the substring of 8-9 is the 2001 in the date1 representing the day i take that substring and convert it into int using parseint

    if(month == 1){return day;} //if month is 1 aka january then the date number is simply the day
    if(month == 2){return 31+day;}//if month is 2 aka february then the date number is all days in january (31) plus the current day
    if(month == 3){return 31+28+day;}//etc
    if(month == 4){return 31+28+31+day;}
    if(month == 5){return 31+28+31+30+day;}
    if(month == 6){return 31+28+31+30+31+day;}
    if(month == 7){return 31+28+31+30+31+30+day;}
    if(month == 8){return 31+28+31+30+31+30+31+day;}
    if(month == 9){return 31+28+31+30+31+30+31+31+day;}
    if(month == 10){return 31+28+31+30+31+30+31+31+30+day;}
    if(month == 11){return 31+28+31+30+31+30+31+31+30+31+day;}
    if(month == 12){return 31+28+31+30+31+30+31+31+30+31+30+day;}
}

//Preconditions: location = [0-9], date1 = [1-365]
async function search(location, date1, position, artist, song, data, dict){
    let out = [];
    let LePendu = [];
    if(artist.length > 0 || song.length > 0){
        let IDs = new Set();
        if(song.length == 0){ // only artist
            for(let i = 0; i < dict.length; ++i){
                if(dict[i][3] == artist)
                    IDs.add(i);
            }
        }
        else if(artist.length == 0){ //only song
            for(let i = 0; i < dict.length; ++i){
                if(dict[i][2] == song)
                    IDs.add(i);
            }
        }
        else{
            for(let i = 0; i < dict.length; ++i){
                if(dict[i][2] == song && dict[i][3] == artist)
                    IDs.add(i);
            }
        }
        //search
        if(position > 0 && IDs.has(data[location][date1][position - 1]))
            out.push([position, location, date1, data[location][date1][position - 1]]);
        else{
            for(let i = 0; i < 200 && out.length <= 10; ++i){
                if(IDs.has(data[location][date1][i]))
                    out.push([i, location, date1, data[location][date1][i]]);
            }
        }
    }
    else{
        if(position > 0)
            out.push([position, location, date1, data[location][date1][position - 1]]);
        else{
            for(let i = 0; i < 10; ++i)
                out.push([i, location, date1, data[location][date1][i]]);
        }
    }

    for(let i = 0; i < out.length; ++i){
        LePendu.push({
            rank: out[i][0],
            country: out[i][1], //need to convert location
            date: date1, //need to convert date
            song_artist: dict[out[i][3]][3],
            song_title: dict[out[i][3]][2]
        });
    }

    return LePendu;
}
