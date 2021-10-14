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
            song_artist: dict[runningList[i][3]][3],
            song_title: dict[runningList[i][3]][2]
        });
    }

    return finalList;
}
