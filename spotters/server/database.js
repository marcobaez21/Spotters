import fs from "fs";

let database = [];
let dict = [];

let unmodifiedDatabase = [];
let unmodifiedDict = [];
let averageCharacteristicsByLocation = [];
let mostFollowers = []; //feature 4
let tenSongsMostNumber1 = []; //feature 5
let tenArtistsMostTop10 = []; //feature 6

fs.readFile("data_10countries_2019.csv", "utf8", function (err, data) {
    let rows = data.split("\n");
    database = rows.map(function (row) { return row.split(","); })
    database.shift();
});

fs.readFile("data_10countries_2019_unmodified.csv", "utf8", function (err, data) {
    let rows = data.split("\n");
    unmodifiedDatabase = rows.map(function (row) { return row.split(","); })
    unmodifiedDatabase.shift();
});

fs.readFile("dict_10countries_2019.csv", "utf8", function (err, data) {
    let rows = data.split("\n");
    unmodifiedDict = rows.map(function (row) { return row.split(","); })
    unmodifiedDict.shift();
});

fs.readFile("dict_10countries_2019_unmodified.csv", "utf8", function (err, data) {
    let rows = data.split("\n");
    dict = rows.map(function (row) { return row.split(","); })
    dict.shift();
});

export function search(rank, country, date, artist, title) {
    let runningList = [];
    let finalList = [];
    let IDs = new Set();

    if (artist.length > 0 || title.length > 0) {
        if (title.length == 0) { //Only artist
            for (let i = 0; i < dict.length; i++) {
                if (dict[i][3] == artist)
                    IDs.add(i);
            }
        }
        else if (artist.length == 0) { //Only song
            for (let i = 0; i < dict.length && i < 20; i++) {
                if (dict[i][2] == title)
                    IDs.add(i);
            }
        }
        else { //Both artist and song
            for (let i = 0; i < dict.length; i++) {
                if (dict[i][2] == title && dict[i][3] == artist)
                    IDs.add(i);
            }
        }
        if (IDs.size == 0) //There was no match
            return runningList;
        else { //Get a list of all matches
            for (let i = 0; i < database.length; i++)
                if (IDs.has(parseInt(database[i][3])))
                    runningList.push(database[i]);
        }
    }

    if (rank.length != 0) { //User specified the rank
        let temp = [];
        if (runningList.length != 0) {
            for (let i = 0; i < runningList.length; i++)
                if (runningList[i][2] == parseInt(rank))
                    temp.push(runningList[i]);
            runningList = temp;
        }
        else {
            for (let i = 0; i < database.length; i++)
                if (database[i][2] == parseInt(rank))
                    temp.push(database[i]);
            runningList = temp;
        }
    }

    if (country.length != 0) { //User specified the country
        let temp = [];
        if (runningList.length != 0) {
            for (let i = 0; i < runningList.length; i++)
                if (runningList[i][0] == country)
                    temp.push(runningList[i]);
            runningList = temp;
        }
        else {
            for (let i = 0; i < database.length; i++)
                if (database[i][0] == country)
                    temp.push(database[i]);
            runningList = temp;
        }
    }

    if (date.length != 0) { //User specified the date
        //Convert date format to match database format
        //replace these two lines with helper function works
        let [year, month, day] = date.split('-');
        date = month + "/" + day + "/" + year;

        let temp = [];
        if (runningList.length != 0) {
            for (let i = 0; i < runningList.length; i++)
                if (runningList[i][1] == date)
                    temp.push(runningList[i]);
            runningList = temp;
        }
        else {
            for (let i = 0; i < database.length; i++)
                if (database[i][1] == date)
                    temp.push(database[i]);
            runningList = temp;
        }
    }

    //Convert runningList into outputable object
    for (let i = 0; i < runningList.length && i < 10; ++i) {
        finalList.push({
            rank: parseInt(runningList[i][2]),
            country: runningList[i][0],
            date: runningList[i][1],
            song_artist: dict[parseInt(runningList[i][3])][3],
            song_title: dict[parseInt(runningList[i][3])][2]
        });
    }

    return finalList;
}

export function dateConvertToStore(date){
    let [year, month, day] = date.split('-');
    return month + "/" + day + "/" + year;
}

export function insertAndUpdate(rank, country, date, artist, song){
    let id = songIDExist(song, artist);
    let d = dateConvertToStore(date); // convert date format
    for(let i = 0; i < database.length; ++i){
        if(database[i][0] == country && database[i][1] == d && database[i][2] == rank){
            database[i][3] = id; //update
            return;
        }
    }
    database.push([country, d, rank, id]); //insert
}

export function songIDExist(title, artist){ //creates dict entry if does not exist
    for(let i = 0; i < dict.length; ++i){
        if(dict[i][2] == title && dict[i][3] == artist)
            return i;
    }
    dict.push([dict.length, -1, title, artist, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
    return dict.length - 1;
}

export function remove(rank, country, date, artist, song){
  
    let foundindex = 0;
    for(let i=0;i<database.length;++i){
        if(country==database[i][0] && dateConvertToStore(date)==database[i][1] && rank==database[i][2]){
            foundindex = i;
        }
        else foundindex = -1;
    }
    if(foundindex != -1) {
        database.splice(foundindex, 1);
    }
}

export function ImportDB(){ //function just rereads the two database files and puts them back into database and dict arrays

console.log("In import function");

fs.readFile("data_10countries_2019.csv", "utf8", function (err, data) {
    let rows = data.split("\n");
    database = rows.map(function (row) { return row.split(","); })
    database.shift();
});

fs.readFile("dict_10countries_2019.csv", "utf8", function (err, data) {
    let rows = data.split("\n");
    dict = rows.map(function (row) { return row.split(","); })
    dict.shift();
});

}

export function ExportDatabase(){
    console.log("In export function");

    fs.open("data_10countries_2019.csv", "r+", function(err, fd) { //opens data file and allows me to do continual read/writes
        let tempstring = "";
        console.log("Succesfully opened data.csv");
        fs.writeFile("data_10countries_2019.csv", "country,date,position,id\n", function(err) { //deleted entire file and then writes the first file
            console.log("Added first line to data.csv");
        });
        for(let i=0; i<database.length; ++i){
            tempstring=database[i][0]+","+database[i][1]+","+database[i][2]+","+database[i][3]+"\n";

            fs.appendFile("data_10countries_2019.csv", tempstring, function(err) { //adds every line after using the database array
            });
        }
        fs.close(fd, function(err){
            console.log("Closed data.csv succesfully");
        });
    });

    fs.open("dict_10countries_2019.csv", "r+", function(err, fd){ //opens dict file and allows me to do continual read/writes
        let tempstring2 = "";
        console.log("Succesfully opened dict.csv"); //line below deletes entire file and the writes the first line
        fs.writeFile("dict_10countries_2019.csv", "id,uri,Title,Artist,Album/Single,Genre,Artist_followers,Explicit,Album,Release_date,Track_number,Tracks_in_album,danceability,energy,key,loudness,mode,speechiness,acoustics,instrumentalness,liveliness,valence,tempo,duration_ms,time_signature,Genre_new,Days_since_release\n", function(err) {
            console.log("Added first line to dict.csv");
        });
        for(let i=0; i<dict.length; ++i){ //27 parameters - line below adds every line after using the dict array
            tempstring2 = dict[i][0]+","+dict[i][1]+","+dict[i][2]+","+dict[i][3]+","+dict[i][4]+","+dict[i][5]+","+dict[i][6]+","+dict[i][7]+","+dict[i][8]+","+dict[i][9]+","+dict[i][10]+","+dict[i][11]+","+dict[i][12]+","+dict[i][13]+","+dict[i][14]+","+dict[i][15]+","+dict[i][16]+","+dict[i][17]+","+dict[i][18]+","+dict[i][19]+","+dict[i][20]+","+dict[i][21]+","+dict[i][22]+","+dict[i][23]+","+dict[i][24]+","+dict[i][25]+","+dict[i][26]+"\n";
            fs.appendFile("dict_10countries_2019.csv", tempstring2, function(err) {
            });
        }
        fs.close(fd, function(err){
            console.log("Closed dict.csv succesfully");
        });
    });
    
}

export function averageCharacteristics(){
    console.log("beginning of avgchar");
    //================row================
    // 0 - Global
    // 1 - USA
    // ...
    // 9 - Australia
    //================col================
    // 0 - total number of songs
    // 1 - average danceability
    // 2 - average energy
    // 3 - average speechiness
    // 4 - average acoustics
    // 5 - average liveliness
    // 6 - average valence
   // let arr = new Array(10).fill(new Array(7).fill(0));
   let arr = [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]];
    const map = new Map([["Global", 0], ["USA", 1], ["UK", 2], ["Canada", 3],["Sweden", 4], ["Mexico", 5],["France", 6], ["Malaysia", 7],["Netherlands", 8], ["Australia", 9]]);
    for(let i = 0; i < unmodifiedDatabase.length; ++i){
        const location = parseInt(map.get(unmodifiedDatabase[i][0]));
       // console.log("loc"+location);
        let id = parseInt(unmodifiedDatabase[i][3]);
       // console.log("id"+id)
        arr[0][0] += 1;
        arr[0][1] += parseInt(unmodifiedDict[id][12]);
        arr[location][2] += parseInt(unmodifiedDict[id][13]);
        arr[location][3] += parseInt(unmodifiedDict[id][17]);
        arr[location][4] += parseInt(unmodifiedDict[id][18]);
        arr[location][5] += parseInt(unmodifiedDict[id][20]);
        arr[location][6] += parseInt(unmodifiedDict[id][21]);
    }
    for(let i = 0; i < arr.length; ++i){
        const total = arr[i][0];
        arr[i][1] /= total;
        arr[i][2] /= total;
        arr[i][3] /= total;
        arr[i][4] /= total;
        arr[i][5] /= total;
        arr[i][6] /= total;
    }
    averageCharacteristicsByLocation = arr;
    console.log("here in averagecharacteristics");
    return averageCharacteristicsByLocation;
}

export function tenArtistTopTen(){
    let map = new Map();
    for(let i = 0; i < unmodifiedDatabase.length; ++i){
        const artists = dict[unmodifiedDatabase[i][3]][3].split(' - ');
        for(let j = 0; j < artists.length; ++j)
            map.set(artists[j], map.get(artists[j] + 1 || 1));
        if(unmodifiedDatabase[i][2] == '10') //skips to the next top 10
            i += 190; //possible bug here
    }
    let sorted = [...map.entries()].sort((a, b) => b[1] - a[1]); //sort instead of using max heap
    for(let i = 0; i < 10; ++i)
        tenArtistsMostTop10.push([sorted[i][0], sorted[i][1]]);
}

export function searchAndReturnCharacteristics(rank, country, date){
    //let chararray = [];
    let tempid = -1;
    let [year, month, day] = date.split('-');
        date = month + "/" + day + "/" + year;
    for(let i=0;i<unmodifiedDatabase.length;i++){ //used to search database to find the id of the song we want characteristics from
        if(unmodifiedDatabase[i][0]==country && unmodifiedDatabase[i][1]==date && unmodifiedDatabase[i][2]==rank){tempid=unmodifiedDatabase[i][3];}
    }
    if(tempid==-1){return;}
    for(let i=0;i<unmodifiedDict.length;i++){
        if(unmodifiedDict[i][0]==tempid){
            let chararray = [unmodifiedDict[i][12], unmodifiedDict[i][13], unmodifiedDict[i][17], unmodifiedDict[i][18], unmodifiedDict[i][20], unmodifiedDict[i][21]];
            console.log(chararray);
            console.log("here in searchandreturn");
            return chararray;
        }
    }
}

export function topArtistMostFollowers(){ //feature 4
    let map = new Map();
    for(let i = 0; i < unmodifiedDict.length; ++i){
        const artists = unmodifiedDict[i][3].split(' - ');
        if(artists.size() != 1)
            continue;
        map.set(unmodifiedDict[i][3], parseInt(unmodifiedDict[i][6]));
    }
    let sorted = [...map.entries()].sort((a, b) => b[1] - a[1]); //reverse sort by value (count) so that top 10 are in front
    for(let i = 0; i < 10; ++i)
        mostFollowers.push(sorted[i][0], sorted[i][1]); //[artist name, count] : [string, int] hopefully
}

export function topSongsMostNumber1(){ //feature 5
    let map = new Map();
    for(let i = 0; i < unmodifiedDatabase.length; i += 200){
        const id = parseInt(unmodifiedDatabase[i][3]);
        const x = map.has(id) ? map.get(id) + 1 : 1;
        map.set(id, x);
    }
    let sorted = [...map.entries()].sort((a, b) => b[1] - a[1]); //reverse sort by value (count) so that top 10 are in front
    for(let i = 0; i < 10; ++i)
        tenSongsMostNumber1.push([unmodifiedDict[sorted[i][0]][2], unmodifiedDict[sorted[i][0]][3], sorted[i][1]]); //[song name, artist name, count] : [string, string, int] hopefully
}

export function topArtistsMostNumber1(){ //feature 6
    let map = new Map();
    for(let i = 0; i < unmodifiedDatabase.length; i += 200){
        const artists = unmodifiedDict[parseInt(unmodifiedDatabase[i][3])][3].split(' - ');
        for(let j = 0; j < artists.length; ++j){
            const key = artists[j];
            const value = map.has(key) ? map.get(key) + 1 : 1;
            map.set(key, value);
        }
    }
    let sorted = [...map.entries()].sort((a, b) => b[1] - a[1]); //reverse sort by value (count) so that top 10 are in front
    for(let i = 0; i < 10; ++i)
        tenArtistsMostTop10.push([unmodifiedDict[sorted[i][0]][3], sorted[i][1]]); //[artist name, count] : [string, int] hopefully
}