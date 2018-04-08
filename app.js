const express = require("express");
const fs = require("fs");
const fortunes = require("./data/fortunes");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

// Write file fortunes.json with new string. Using fs of Express
const writeAFile = (json) => {  
    fs.writeFile('./data/fortunes.json', JSON.stringify(json), err => console.log(err));
};

app.get('/fortunes', (req, res) => {
    res.json(fortunes);
});

app.get('/fortunes/random', (req, res) => {
    const index = Math.floor(Math.random() * fortunes.length);
    res.json(fortunes[index]);
});

app.get('/fortunes/:id', (req, res) => {
    res.json(fortunes.find(f => f.id == req.params.id ))
});



// Tạo mới 1 object
app.post('/fortunes', (req, res) => {  
    // Get body of request and assign to variables
    const { message, lucky_number, spirit_animal } = req.body;
    // Create a variable that store ids of fortunes array
    const fortunes_ids = fortunes.map(f => f.id);
    // Create a fortune
    const fortune = {
        id: (fortunes_ids.length > 0 ? Math.max(...fortunes_ids) : 0) + 1,
        message,
        lucky_number,
        spirit_animal
    };
    // Create a new fortune array and combine to existing fortune array
    const new_fortunes = fortunes.concat(fortune);
    writeAFile(new_fortunes);
    res.json(new_fortunes);

})

// Update 1 object
app.put('/fortunes/:id', (req, res) => {  
    // Get params from endpoint of fortune id
    const { id } = req.params;

    // Get a fortune that need to be updated
    const old_fortunes = fortunes.find(f => f.id == id);

    // Update old fortune
    ["message", "lucky_number", "spirit_animal"].forEach(key => {
        if (req.body[key]) old_fortunes[key] = req.body[key];
    });
    
    writeAFile(fortunes);
    res.json(fortunes);

})

// Delete 1 object
app.delete('/fortunes/:id', (req, res) => {  
    // Get params from endpoint of fortune id
    const { id } = req.params;

    // Get a fortune that need to be updated
    const new_fortunes = fortunes.filter(f => f.id != id);

    // Update old fortune
   
    writeAFile(new_fortunes);
    res.json(new_fortunes);

})

module.exports = app;

