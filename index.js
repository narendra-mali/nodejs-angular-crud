const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 5000;

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "Users",

});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database: ', err);
        return;
    }
    console.log('Connected to MySQL database');
});

app.post('/api/createUser', (req, res) => {
    const { name, email } = req.body;
    const query = `INSERT INTO users (name, email) VALUES (?, ?)`;
    connection.query(query, [name, email], (err, results) => {
        if (err) {
            console.error('Error creating user: ', err);
            res.status(500).send('Error creating user');
            return;
        }
        res.status(201).send('User created successfully');
    });
});

// Read
app.get('/api/getUsers', (req, res) => {
    const query = `SELECT * FROM users`;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching users: ', err);
            res.status(500).send('Error fetching users');
            return;
        }
        res.json(results);
    });
});

app.get('/api/getUser/:id', (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM users WHERE id = ?`;
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching user: ', err);
            res.status(500).send('Error fetching user');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('User not found');
            return;
        }
        res.json(results[0]);
    });
});

app.put('/api/updateUser/:id', (req, res) => {
    const { name, email } = req.body;
    const id = req.params.id;
    const query = `UPDATE users SET name = ?, email = ? WHERE id = ?`;
    connection.query(query, [name, email, id], (err, results) => {
        if (err) {
            console.error('Error updating user: ', err);
            res.status(500).send('Error updating user');
            return;
        }
        res.status(200).send('User updated successfully');
    });
});

app.delete('/api/deleteUser/:id', (req, res) => {
    const id = req.params.id;
    const query = `DELETE FROM users WHERE id = ?`;
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error deleting user: ', err);
            res.status(500).send('Error deleting user');
            return;
        }
        res.status(200).send('User deleted successfully');
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
