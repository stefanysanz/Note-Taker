const path = require('path')
const express = require("express")
const cors = require("cors")
const routes = require("./routes/routes.js")

const port = 8000

const app = express()
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.listen(port, () => {
    console.log(`listening on http://localhost:${port}`)
})

routes.create(app)