const http = require('http');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const phonebookData = require('./data/phonebook');
const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
    response.send('<h1>Welcome to the API</h1>');
});

let notes = [
    {
        "id": "1",
        "content": "HTML is easy",
        "important": true
    },
    {
        "id": "2",
        "content": "Browser can execute only JavaScript",
        "important": false
    },
    {
        "id": "3",
        "content": "GET and POST are the most important methods of HTTP protocol",
        "important": true
    },
    {
        "id": "4",
        "content": "adding New not to server",
        "date": "2024-10-19T21:18:31.852Z",
        "important": false
    },
    {
        "id": "5",
        "content": "a new note...another add to server",
        "date": "2024-10-31T04:54:32.347Z",
        "important": true
    },
    {
        "id": "6",
        "content": "What is in a name ?",
        "date": "2024-10-31T17:44:48.167Z",
        "important": false
    },
    {
        "id": "7",
        "content": "What do you mean when you say the would \"I\"",
        "date": "2024-10-31T17:45:19.069Z",
        "important": false
    }
]

let persons = [...phonebookData];

app.get('/api/notes', (request, response) => {
    response.status(200).send(notes);
})
app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    const note = notes.find(note => note.id === id);
    if (note) {
        response.status(200).send(note);
    } else {
        response.status(404).send({ error: 'Note not found' });
    }
})
app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id;
    notes = notes.filter(note => note.id !== id);
    response.status(204).end();
})

app.post('/api/notes', (request, response) => {
    const body = request.body;
    if (!body.content) {
        return response.status(400).json({ error: 'content missing' });
    }
    const ids = notes.map(note => note.id);
    const maxId = Math.max(...ids);
    const newNote = {
        id: (maxId + 1).toString(),
        content: body.content,
        important: body.important || false,
        date: new Date().toISOString()
    }
    notes = [...notes, newNote];
    console.log(newNote);
    response.status(201).send(newNote);
})

// Phone book endpoints

app.get('/api/persons', (request, response) => {
    response.status(200).send({ data: phonebookData });
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const person = phonebookData.find(person => person.id === id);
    if (person) {
        response.status(200).send({ data: person });
    } else {
        response.status(404).send({ error: 'Person not found' });
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    persons = persons.filter(person => person.id !== id);
    response.status(202).send({ data: persons });
})

app.post('/api/persons', (request, response) => {
    const body = request.body;
    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'name or number missing' });
    }
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ error: 'name must be unique' });
    }
    const ids = persons.map(person => person.id);
    const maxId = Math.max(...ids);
    const newPerson = {
        id: (maxId + 1).toString(),
        name: body.name,
        number: body.number
    }
    persons = [...persons, newPerson];
    response.status(201).send({ data: newPerson });
});

app.put('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({ error: 'Name or number is missing' });
    }
    const personIndex = persons.findIndex(person => person.id === id);
    if (personIndex === -1) {
        return response.status(404).json({ error: 'Person not found' });
    }

    const updatedPerson = { ...persons[personIndex], name: body.name, number: body.number };
    persons[personIndex] = updatedPerson;

    response.status(200).send({ data: updatedPerson });
})

app.use((request, response) => {
    response.status(404).send({ error: 'Endpoint not found.' });
});

app.use((err, req, res, next) => {
    console.errror(err.stack);
    response.status(500).send({ error: 'Something went wrong on the server!' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
