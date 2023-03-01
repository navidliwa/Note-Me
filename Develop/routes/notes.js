const fs = require('fs');
const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, writeToFile, readFromFile } = require('../helpers/fsUtils');
const db = require('../db/db.json');

// Get route on /api/notes that gets all the notes
router.get('/notes', (req, res) => {
    readFromFile('../Develop/db/db.json')
        .then((data) => {
            const notes = JSON.parse(data);

            const updatedNotes = notes.map((note) => ({
                ...note,
                id: uuidv4()
            }));

            writeToFile('../Develop/db/db.json', updatedNotes);

            res.json(updatedNotes);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json('Error updating db.json');
        });
});

// Post route to add a note
router.post('/notes', (req, res) => {
    const { title, text } = req.body;

    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4(),
        };

        readAndAppend(newNote, '../Develop/db/db.json');
        const response = {
            status: 'success',
            body: newNote
        };

        res.json(response);
    } else {
        res.json('Error in adding new note.');
    }
});

// Delete route on /api/notes that'll be a param route that uses the id
router.delete('/notes/:id', (req, res) => {
    const Id = req.params.id;
    console.log(Id);
    readFromFile('../Develop/db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // use filter to filter out the item with the desired id
            const result = json.filter((note) => note.id !== Id);

            writeToFile('../Develop/db/db.json', result);

            res.json(`Note with id:${Id} has been deleted 🗑️!`);
        });
})


module.exports = router;