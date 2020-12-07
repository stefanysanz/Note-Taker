const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const express = require("express");
const app = express();
// Middleware
// This is for handling JSON
// just copy and paste this
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const port = 8000;

app.listen(port, () => {
    console.log("listening on http://localhost:${port}");
})

app.get("/api/notes", (req, res) => {
    console.log(`{"endpoint":"GET_NOTES","message":"request-received"}`);

    // Open the file
    fs.readFile("../db/db.json", "utf8", (err, rawData) => {
        if (err) {
            console.log(error);
            return
        }

        // Parse the file
        data = JSON.parse(rawData);

       
        // Handle success
        res.send({
            code: 200,
            status: "success",
            notes: data
        });
    })

})

app.post("/api/notes", (req, res) => {
    console.log(`{"endpoint":"CREATE_NOTE","message":"request-received"}`);

    let data;
    let note;

    // Open the file
    fs.readFile("../db/db.json", "utf8", (err, rawData) => {
        if (err) {
            console.log(error);
            return
        }

        // Parse the file
        data = JSON.parse(rawData);

        // Create the new note
        note = {
            id: uuidv4(),
            note: req.body.note
        }

        // Push the note onto the array
        data.notes.push(note);

        // Overwrite the file
        fs.writeFile("../db/db.json", JSON.stringify(data), (err) => {
            if (err) {
                console.log(error);
                return
            }

             // Handle success
             res.send({
                code: 200,
                status: "success",
                note: note
            });
        })

    })
})

app.delete("/api/notes/:id", (req, res) => {
    console.log(`{"endpoint":"DELETE_NOTE","message":"request-received"}`);
    
    
    let data;
    let note;
    let notes = [];

    // Open the file
    fs.readFile("../db/db.json", "utf8", (err, rawData) => {
        if (err) {
            console.log(error);
            return
        }

        // Parse the file
        let found = false;
        data = JSON.parse(rawData);
        for (let i = 0; i < data.notes.length; i++) {
            let n = data.notes[i];
            if (n.id != req.params.id) {
                notes.push(n);
            } else {
                found = true;
                note = n;
            }
        }
        if (!found) {
            res.send({
                code: 404,
                status: "not found",
                message: "note not found"
            });
            return
        }

        // Push the note onto the array
        data.notes = notes;

        // Overwrite the file
        fs.writeFile("../db/db.json", JSON.stringify(data), (err) => {
            if (err) {
                console.log(error);
                return
            }

            // Handle success
            res.send({
                code: 200,
                status: "ok",
                message: "success",
                note: note
            });
        })

    })
})

