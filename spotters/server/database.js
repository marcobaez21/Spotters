import fs from "fs";

let database = [];
let dict = [];

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
