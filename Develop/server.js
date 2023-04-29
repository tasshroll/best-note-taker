let express = require('express');
let fs = require('fs');
const db = require('./db/db.json'); 
const path = require('path');
const nanoid = require(`nanoid`);

const PORT = 3001;

const app = express();

// handle incoming requests with JSON or URL-encoded payloads, 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve images, css files, js files from the public directory
// Allows reference to files with their relative path
app.use(express.static("public"));

// Routes

// `GET /notes` should return the `notes.html` file.
app.get('/notes', (req, res) => {
    console.log("/notes is called");
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});
// `GET /api/notes` should read the `db.json` file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
    console.log("api/notes is called, sending db.json");
    res.json(db);
});
//`GET *` should return the `index.html` file.
app.get('*', (req, res) => {
    console.log("/ is called");
    res.sendFile(path.join(__dirname, '/public/index.html'))
});


//`POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, 
//and then return the new note to the client. You'll need to find a way to give each note a unique id when 
//it's saved (look into npm packages that could do this for you).
// app.post('/api/notes', (req, res) => {
//     // Log that post request was received
//     console.log(`${req.method} request was received to add a new note`);

//     // destructure the note title and text from request body
//     const { title, text } = req.body;
//     console.log(`Note title is ${title} and note text is ${text}`);
//     if (title && text){
//         const newNote ={
//             title,
//             text,
//             id : nanoid(),
//         }
//         console.log("newNote to store is "newNote);
//         //fs.appendFile(db),newNote
//      }
// }
//
app.listen (PORT, () =>
    console.log(`Express server listening on port ${PORT}`)
);
