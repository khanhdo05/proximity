const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

let users = [];

app.post('/signup', (req, res) => {
    const { username } = req.body;
    if (users.includes(username)) {
        return res.status(400).json({ message: 'Username already taken' });
    }
    users.push(username);
    res.status(201).json({ message: 'User created successfully' });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});