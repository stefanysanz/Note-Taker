const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

exports.create = (app) => {

    app.get("/api/notes", (req, res) => {
        console.log(`{"endpoint":"GET_NOTES","message":"request-received"}`)

        let rawData

        // Open the file
        try {
            rawData = fs.readFileSync("./db/db.json", "utf8")
        } catch (err) {
            console.log(err)
            internalServerError(res)
            return
        }

        // Parse the data
        const data = JSON.parse(rawData)

        // Handle success
        res.status(200)
        res.send({
            code: 200,
            status: "OK",
            message: "note created",
            notes: data.notes,
        })
    })

    app.post("/api/notes", (req, res) => {
        console.log(`{"endpoint":"CREATE_NOTE","message":"request-received"}`)

        let rawData

        // Open the file
        try {
            rawData = fs.readFileSync("./db/db.json", "utf8")
        } catch (err) {
            console.log(err)
            internalServerError(res)
            return
        }

        // Parse the data
        const data = JSON.parse(rawData)

        // Create a new note
        const note = {
            id: uuidv4(),
            title: req.body.title,
            text: req.body.text
        }

        // Push the note onto the array
        data.notes.push(note)

        // Overwrite the file
        try {
            fs.writeFileSync("./db/db.json", JSON.stringify(data))
        } catch(err) {
            console.log(err)
            internalServerError(res)
            return
        }

        
        // Handle success
        res.status(200)
        res.send({
            code: 200,
            status: "OK",
            message: "note created",
            note: note,
        })
    })

    app.delete("/api/notes/:id", (req, res) => {
        console.log(`{"endpoint":"DELETE_NOTE","message":"request-received"}`)

        let rawData

        // Open the file
        try {
            rawData = fs.readFileSync("./db/db.json", "utf8")
        } catch (err) {
            console.log(err)
            internalServerError(res)
            return
        }
        
        // Parse the data
        const data = JSON.parse(rawData)
        
        let note
        let notes = []
        let found = false
        for (let i = 0; i < data.notes.length; i++) {
            let n = data.notes[i]
            if (n.id != req.params.id) {
                notes.push(n)
            } else {
                found = true
                note = n
            }
        }

        // Respond with success if the note is not found
        if (!found) {
            res.send({
                code: 200,
                status: "OK",
                message: "note deleted",
                note: note
            })
            return
        }

        // Push the note onto the array
        data.notes = notes

        // Overwrite the file
        try {
            fs.writeFileSync("./db/db.json", JSON.stringify(data))
        } catch(err) {
            console.log(err)
            internalServerError(res)
            return
        }

        // Handle success
        res.send({
            code: 200,
            status: "OK",
            message: "note deleted",
            note: note
        }) 
    })

    const internalServerError = (res) => {
        res.status(500)
        res.send({
            code: 500,
            status: "Internal Server Error",
        })
    }
}