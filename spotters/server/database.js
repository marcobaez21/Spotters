import { SSL_OP_NO_TLSv1_2, SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from "constants";
import fs from "fs";

let database = [];
let dict = [];
let top10 = [];

//let unmodifiedDatabase = [];
//let unmodifiedDict = [];
let averageCharacteristicsByLocation = [];
let mostFollowers = []; //feature 4
let tenSongsMostNumber1 = []; //feature 5
let tenArtistsMostTop10 = []; //feature 6
let topArtistsMostNum1 = [];

let tenArtistsMostTop10MAP = new Map();
let topArtistsMostNum1MAP = new Map();



fs.readFile("data_10countries_2019.csv", "utf8", function (err, data) {
    let rows = data.split("\n");
    database = rows.map(function (row) { return row.split(","); })
    database.shift();
});

/*fs.readFile("data_10countries_2019_unmodified.csv", "utf8", function (err, data) {
    let rows = data.split("\n");
    unmodifiedDatabase = rows.map(function (row) { return row.split(","); })
    unmodifiedDatabase.shift();
});*/

fs.readFile("dict_10countries_2019.csv", "utf8", function (err, data) {
    let rows = data.split("\n");
    dict = rows.map(function (row) { return row.split(","); })
    dict.shift();
});

/*fs.readFile("dict_10countries_2019_unmodified.csv", "utf8", function (err, data) {
    let rows = data.split("\n");
    unmodifiedDict = rows.map(function (row) { return row.split(","); })
    unmodifiedDict.shift();
});*/

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
    let id = songIDExist(song, artist, rank);
    let d = dateConvertToStore(date); // convert date format
    for(let i = 0; i < database.length; ++i){
        if(database[i][0] == country && database[i][1] == d && database[i][2] == rank){
            database[i][3] = id; //update
            return;
        }
    }
    database.push([country, d, rank, id]); //insert



    //incremental analytics
    //artists with most top 10:
    if(parseInt(rank) <= 10){
        const artists = artist.split(' - ');
        for(let j = 0; j < artists.length; ++j) {
            if (artists[j] != '') {
                if (!tenArtistsMostTop10MAP.has(artists[j])) 
                    tenArtistsMostTop10MAP.set(artists[j], 0);
                tenArtistsMostTop10MAP.set(artists[j], tenArtistsMostTop10MAP.get(artists[j]) + 1);
            }
        }
    }   
    //END - artists with most top 10

    //artists with most #1:
    if(parseInt(rank) == 1){
        const artists = artist.split(' - ');
        for(let j = 0; j < artists.length; ++j) {
            if (artists[j] != '') {
                if (!topArtistsMostNum1MAP.has(artists[j])) 
                    topArtistsMostNum1MAP.set(artists[j], 0);
                topArtistsMostNum1MAP.set(artists[j], topArtistsMostNum1MAP.get(artists[j]) + 1);
            }
        }
    }   
    //END - artists with most #1

}

export function songIDExist(title, artist, rank){ //creates dict entry if does not exist
    for(let i = 0; i < dict.length; ++i){
        if(dict[i][2] == title && dict[i][3] == artist){
            //incremental analytics
            //artists with most top 10:
            if(parseInt(rank) <= 10){
                const artists = dict[i][3].split(' - ');
                for(let j = 0; j < artists.length; ++j) {
                    if (artists[j] != '') {
                        if(tenArtistsMostTop10MAP.get(artists[j]) == 1)
                            tenArtistsMostTop10MAP.delete(tenArtistsMostTop10MAP.get(artists[j]));
                        else
                            tenArtistsMostTop10MAP.set(artists[j], tenArtistsMostTop10MAP.get(artists[j]) - 1);
                    }
                }
            }
            //END - artists with most top 10

            //artists with most #1:
            if(parseInt(rank) == 1){
                const artists = dict[i][3].split(' - ');
                for(let j = 0; j < artists.length; ++j) {
                    if (artists[j] != '') {
                        if(topArtistsMostNum1MAP.get(artists[j]) == 1)
                            topArtistsMostNum1MAP.delete(topArtistsMostNum1MAP.get(artists[j]));
                        else
                            topArtistsMostNum1MAP.set(artists[j], topArtistsMostNum1MAP.get(artists[j]) - 1);
                    }
                }
            }   
            //END - artists with most #1
            
            return i;
        }
    }
    dict.push([dict.length, -1, title, artist, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]);
    return dict.length - 1;
}

export function remove(rank, country, date, artist, song){
  
    let foundindex = -1;
    for(let i = 0; i < database.length; ++i){
        if(country.toLowerCase() == database[i][0].toLowerCase() && dateConvertToStore(date) == database[i][1] && parseInt(rank) == parseInt(database[i][2])){
            foundindex = i;
            break;
        }
    }
    if(foundindex != -1) {
        //incremental analytics
        //artists with most top 10:
        if(parseInt(rank) <= 10){
            const artists = dict[database[foundindex][3]][3].split(' - ');
            for(let j = 0; j < artists.length; ++j) {
                if (artists[j] != '') {
                    if(tenArtistsMostTop10MAP.get(artists[j]) == 1)
                        tenArtistsMostTop10MAP.delete(tenArtistsMostTop10MAP.get(artists[j]));
                    else
                        tenArtistsMostTop10MAP.set(artists[j], tenArtistsMostTop10MAP.get(artists[j]) - 1);
                }
            }
        }
        //END - artists with most top 10

        //artists with most #1:
        if(parseInt(rank) == 1){
            const artists = dict[database[foundindex][3]][3].split(' - ');
            for(let j = 0; j < artists.length; ++j) {
                if (artists[j] != '') {
                    if(topArtistsMostNum1MAP.get(artists[j]) == 1)
                        topArtistsMostNum1MAP.delete(topArtistsMostNum1MAP.get(artists[j]));
                    else
                        topArtistsMostNum1MAP.set(artists[j], topArtistsMostNum1MAP.get(artists[j]) - 1);
                }
            }
        }
        //END - artists with most #1
        tenSongsMostNumber1 = [];
        averageCharacteristicsByLocation = [];
        mostFollowers = []; //feature 4
        tenArtistsMostTop10 = []; //feature 6
        topArtistsMostNum1 = [];

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
   // console.log("beginning of avgchar");
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
    //let arr = new Array(10).fill(new Array(7).fill(0));
   // var arr = [];
   let arr = [[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
              [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
              [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
              [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
              [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
              [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
              [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
              [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
              [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], 
              [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]];
   //let arr = [];
   const map = new Map([["Global", 0], ["USA", 1], ["UK", 2], ["Canada", 3],["Sweden", 4], ["Mexico", 5],["France", 6], ["Malaysia", 7],["Netherlands", 8], ["Australia", 9]]);
   let location = 0;
   /*
   console.log("data: "+database[0][0]);
   console.log("map output: (should be 0)"+map.get(database[0][0]));
   console.log(typeof(map.get(database[0][0])));
   console.log("id: (should be 1)"+database[1][3]);
   console.log(typeof(database[1][3]));
   console.log("first song"+dict[0]);
   let id2 = parseInt(database[0][3]);
   console.log("dancability (should be 0.83): "+parseFloat(dict[id2][12]));
   console.log(typeof(parseFloat(dict[0][12])));
   console.log(database.length);*/
 
    for(let i = 0; i < database.length; ++i){
        location = map.get(database[i][0]);
      //  console.log(map.get(unmodifiedDatabase[i][0]));
      //  console.log(typeof(location));
      //  console.log("loc"+location);
        let id = parseInt(database[i][3]);
       // console.log("id"+id)
        arr[location][0] += 1.0;
        //arr[location][1] += (1.0*(dict[id][12]));
        //arr[location][2] += (1.0*(dict[id][13]));
        arr[location][1] += (1.0*(dict[id][17]));
        arr[location][2] += (1.0*(dict[id][18]));
        arr[location][3] += (1.0*(dict[id][17]));
        arr[location][4] += (1.0*(dict[id][18]));
        arr[location][5] += (1.0*(dict[id][20]));
        arr[location][6] += (1.0*(dict[id][21]));
    }
   // console.log(arr);
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
   // console.log("here in averagecharacteristics");
    //console.log(arr);
    return averageCharacteristicsByLocation;
   // return arr;
}

export function tenArtistTopTen(){
    if(tenArtistsMostTop10.length == 0){ //only run this part at the beginning
        for(let i = 0; i < (database.length - 1); ++i){
         //   const artists = dict[parseInt(database[i][3])][3].split(' - ');
         const artists = dict[1*(database[i][3])][3].split(' - ');

            for(let j = 0; j < artists.length; ++j) {
                if (artists[j] != '') {
                    if (!tenArtistsMostTop10MAP.has(artists[j])) 
                        tenArtistsMostTop10MAP.set(artists[j], 0);
                    tenArtistsMostTop10MAP.set(artists[j], tenArtistsMostTop10MAP.get(artists[j]) + 1);
                }
            }
            if(database[i][2] == '10') //skips to the next top 10
                i += 190;
        }
    
        let sorted = [...tenArtistsMostTop10MAP.entries()].sort((a, b) => b[1] - a[1]); //sort instead of using max heap
        for(let i = 0; i < 10; ++i)
            tenArtistsMostTop10.push([sorted[i][0], sorted[i][1]]);
    }    
    // console.log("First: " + tenArtistsMostTop10[0][0]);
    // console.log("in top ten");
    // console.log(tenArtistsMostTop10);

    return tenArtistsMostTop10 ;
}

export function searchAndReturnCharacteristics(rank, country, date){
    rank = rank+".0"; //need to concatonate ".0" since the rank in the database is stored as 1.0 where the frontend returns 1
    let chararray = [-1, -1, -1, -1, -1, -1, -1];
   let tempid = -1;
    let [year, month, day] = date.split('-'); //changing date to databases form
        date = day + "/" + month + "/" + year;
    for(let i=0;i<database.length;i++){ //used to search database to find the id of the song we want characteristics from
       if(database[i][0]==country && database[i][1]==date && database[i][2] == rank ){tempid=database[i][3];}
    }
   // if(tempid==-1){return;}
    for(let i=0;i<dict.length;i++){ //used to search through the dict with our tempid and then returning an array of song characteristics
        if(parseInt(dict[i][0])==parseInt(tempid)){
           chararray = [ dict[i][12], dict[i][13], dict[i][17], dict[i][18], dict[i][20], dict[i][21]];
          //  console.log(chararray);
         //   console.log("here in searchandreturn");
            return chararray;
        }
    }
}

export function topArtistMostFollowers(){ //feature 4
    if(mostFollowers.length!=0){return mostFollowers;}
    let map = new Map();
    for(let i = 0; i < dict.length; ++i){
        if(dict[i].length <= 1)
            continue;
        const artists = dict[i][3].split(' - '); //original
        //if(artists.size() != 1) //original
        if(artists.length != 1)
            continue;
        
        map.set(dict[i][3], parseInt(dict[i][6]));
    }
    let sorted = [...map.entries()].sort((a, b) => b[1] - a[1]); //reverse sort by value (count) so that top 10 are in front
    for(let i = 1; i < 11; ++i)
        mostFollowers.push(sorted[i][0], sorted[i][1]); //[artist name, count] : [string, int] hopefully
      //  console.log("First: " + mostFollowers[0][0]);
      //  console.log("top most followers");
      //  console.log(mostFollowers);
    return mostFollowers;   
}

export function topSongsMostNumber1(){ //feature 5
    console.time();
    if(tenSongsMostNumber1.length!=0){return tenSongsMostNumber1;}
    let map = new Map();
    for(let i = 0; i < database.length; i += 200){
        const id = parseInt(database[i][3]);
        const x = map.has(id) ? map.get(id) + 1 : 1;
        map.set(id, x);
    }
    let sorted = [...map.entries()].sort((a, b) => b[1] - a[1]); //reverse sort by value (count) so that top 10 are in front
    for(let i = 0; i < 11; ++i){
        if(i==1)
            continue;
        tenSongsMostNumber1.push([dict[sorted[i][0]][2], dict[sorted[i][0]][3], sorted[i][1]]); //[song name, artist name, count] : [string, string, int] hopefully
    }
    console.timeEnd();
        console.log("First: " + tenSongsMostNumber1[0][0]);
        console.log("ten Songs Most Number 1");
       console.log(tenSongsMostNumber1);
    return tenSongsMostNumber1
}

export function topArtistsMostNumber1(){ //feature 6
    // if(topArtistsMostNum1.length!=0){return topArtistsMostNum1;}

    if(topArtistsMostNum1.length == 0){
        for(let i = 0; i < database.length; i += 200){
            if(isNaN(parseInt(database[i][3])) ||  dict[parseInt(database[i][3])].length <= 1)
                continue;
            const artists = dict[parseInt(database[i][3])][3].split(' - ');
            for(let j = 0; j < artists.length; ++j){
                const key = artists[j];
                const value = topArtistsMostNum1MAP.has(key) ? topArtistsMostNum1MAP.get(key) + 1 : 1;
                topArtistsMostNum1MAP.set(key, value);
            }
        }
    
        let sorted = [...topArtistsMostNum1MAP.entries()].sort((a, b) => b[1] - a[1]); //reverse sort by value (count) so that top 10 are in front
        for(let i = 2; i < 13; ++i){
            if(i==8)
                continue;
            //console.log(sorted[i][0]);
            topArtistsMostNum1.push([sorted[i][0], sorted[i][1]]); //[artist name, count] : [string, int] hopefully
        }
    }
  //  console.log("First: " + topArtistsMostNum1[0][0]);
  //  console.log("ten artists most top 10");
  //  console.log(topArtistsMostNum1);
    return topArtistsMostNum1;
}

export function top10genre(country) { //Jessie's feature 2 function
    let mostTop10 = [];
   // if(top10.length != 0){return mostTop10;}
    let map = new Map();

    for (let i = 0; i < dict.length; ++i) {
        let gen = dict[i][5];
        
        if(gen!='' && gen!="n-a"){
        if (!map.has(gen)) 
            map.set(gen, 0);

        if (parseInt(database[i][2]) >= 1 && parseInt(database[i][2]) <= 50)
            map.set(gen, map.get(gen) + 1);
        else if (parseInt(database[i][2]) >= 51 && parseInt(database[i][2] <= 100))
            map.set(gen, map.get(gen) + 1/*0.8*/);
        else if (parseInt(database[i][2]) >= 101 && parseInt(database[i][2]) <= 200)
            map.set(gen, map.get(gen) + 1/*0.7*/);
        }
    }

    let sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
    for(let i = 0; i < 10; ++i) {
        mostTop10.push([sorted[i][0], sorted[i][1]]);
    }

    top10 = mostTop10;
  //  console.log("Top 10: " + top10); // check

    return top10;
}