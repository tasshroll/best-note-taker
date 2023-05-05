let express = require('express');
let fs = require('fs');
const db = require('./db/db.json');
const path = require('path');
const { nanoid } = require(`nanoid`);

//const PORT = 3001;
// needed for server to run on Heroku platform
const PORT = process.env.PORT || 3001;

// instantiate express in var app
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

//`POST /api/notes` should receive a new note to save on the request body, add it to the `db.json` file, 
//and then return the new note to the client. Each note is given a unique id using nanoid package
app.post('/api/notes', (req, res) => {
    // Log that post request was received
    console.log(`${req.method} request was received to add a new note`);

    // destructure the note title and text from request body
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: nanoid(),
        }
        console.log(`Note title is ${title} and note text is ${text}`);
        addNote(newNote, res);

    };
});

// fetch(`/api/notes/${id}`
// get the query param 
app.delete('/api/notes/:id', (req, res) => {
    console.log(`${req.method} request was received to delete a new note`);
    // Get the id out of the URL (?id=a234Jsldkfjs2345234)
    // console.log ("Req is ", req.query);
    const id = req.params.id;
    console.log("Query is : ", id);
    removeNote(id, res);
}); // end app.delete


// app.delete('/api/notes/', (req, res) => {
//     // Log that post request was received
//     console.log(`${req.method} request was received to add a new note`);

// const deleteNote = (id) =>
//   fetch(`/api/notes/${id}`, {
//     method: 'DELETE',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//`GET *` should return the `index.html` file.
app.get('*', (req, res) => {
    console.log("/ is called");
    res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
    console.log(`Express server listening on port ${PORT}`)
);


function addNote(newNote, res) {
    // Add new note to db.json
    // Read contents of db.json, parse the ddata, and then push new note object into the array
    fs.readFile('./db/db.json', (err, storedNotes) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error reading db");
        }
        const notesArr = JSON.parse(storedNotes);
        notesArr.push(newNote);
        console.log("notesArr is ", notesArr);

        // null is used to replace any function values in the object with null to ensure that 
        // the stringified object is valid JSON. The argument 4 specifies the number of spaces to 
        // use for indentation, by adding 4 spaces of indentation for each nested level. 
        const jsonNotesArr = JSON.stringify(notesArr, null, 4); // pretty print with 4 spaces indentation

        console.log("Stringified DB is ", jsonNotesArr);

        fs.writeFile('./db/db.json', jsonNotesArr, (err) => {
            if (err) {
                console.log(err);
                return res.status(500).send("Error writing to db");
            }
            console.log('Note added to database as', newNote);
            // Send client the newNote in the response
            res.json(newNote);
        }); // end of writeFile
    }); // end of readFile
} // end of add Note


function removeNote(id, res) {
    // Add new note to db.json
    // Read contents of db.json, parse the ddata, and then push new note object into the array
    fs.readFile('./db/db.json', (err, storedNotes) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error reading db");
        }
        const notesArr = JSON.parse(storedNotes);
        let removed = false;
        for (let i = 0; i < notesArr.length; i++) {
            const noteID = notesArr[i].id;
            if (noteID == id) {
                console.log("Object to remove is :", notesArr[i]);
                // remove that object
                notesArr.splice(i, 1); // remove 1 object at index i
                removed = true;
                // exit out of loop
                break;
            }
        }
        if (!removed) {
            return res.status(404).send("Note not found");
        }

        // null is used to replace any function values in the object with null to ensure that 
        // the stringified object is valid JSON. The argument 4 specifies the number of spaces to 
        // use for indentation, by adding 4 spaces of indentation for each nested level. 
        const jsonNotesArr = JSON.stringify(notesArr, null, 4); // pretty print with 4 spaces indentation
        //console.log("Stringified DB is ", jsonNotesArr);
        fs.writeFile('./db/db.json', jsonNotesArr, (err) => {
            if (err) {
                console.log(err)
                return res.status(500).send("Error writing to db");
            }
            console.log('Note deleted from the database was id ', id);
            // Send client the new notesArr in the response
            res.json(notesArr);
        }); // end of writeFile
    }); // end of readFile
} // end of removve Note



