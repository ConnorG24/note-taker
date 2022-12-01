const fs = require('fs');
const express = require('express');
const app = express();
const path = require("path");

const PORT = process.env.PORT || 33667;

// Middleware for parsing JSON and urlencoded form data
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//note route
app.get('/notes',function(req,res){
    res.sendFile(path.join(__dirname,'/public/notes.html'));
});

// route to db.json
app.get('/api/notes', function(req, res){
    
        res.sendFile(path.join(__dirname, '/db/db.json'));
    });

// route to html
app.get('*', (req, res) => {
res.sendFile(path.join(__dirname, '/public/index.html'));
    });

//add new note to db.json
app.post('/api/notes',function(req,res){
    let newNote = req.body;
    let noteList = JSON.parse(fs.readFileSync('./db/db.json','utf8'));
    let noteLength = (noteList.length).toString();
    newNote.id = noteLength;
    noteList.push(newNote);

    fs.writeFileSync('./db/db.json', JSON.stringify(noteList));
    res.json(noteList);

});
//delete notes from db.json
app.delete('/api/notes/:id',function(req,res){
    let noteList = JSON.parse(fs.readFileSync('./db/db.json','utf8'));
    let noteId = (req.params.id).toString();
    
    noteList = noteList.filter(selected =>{
        return selected.id != noteId;
    });

    fs.writeFileSync('./db/db.json', JSON.stringify(noteList));
    res.json(noteList);

});



app.listen(PORT, function(){
    console.log(`app listening at http://localhost:${PORT}`);
});