// This code snippet demonstrates a simplified vulnerable implementation.
// DO NOT use this code in production environments.

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());

// Insecure SQL query construction
app.post('/users', (req, res) => {
  const name = req.body.name;
  const query = `INSERT INTO users (name) VALUES ('${name}')`;

  // Execute the insecure SQL query
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mydatabase'
  });

  connection.connect();
  connection.query(query, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ message: 'User created successfully' });
  });
  connection.end();
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// This code represents a simplified Node.js application that handles user creation through a /users endpoint using an
//  SQL database.
// The vulnerable code snippet demonstrates the use of string concatenation to construct SQL queries, which is susceptible
//  to SQL injection attacks.
// The value of the name property from the request body is directly interpolated into the SQL query, allowing an 
// attacker to manipulate the query and potentially perform unauthorized actions on the database.

// Mitigation 

// This code snippet includes mitigation measures to address the Injection Attacks vulnerability.

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
app.use(bodyParser.json());

// Secure SQL query construction using prepared statements
app.post('/users', (req, res) => {
  const name = req.body.name;
  const query = 'INSERT INTO users (name) VALUES (?)';
  const values = [name];

  // Execute the secure SQL query
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mydatabase'
  });

  connection.connect();
  connection.query(query, values, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    res.json({ message: 'User created successfully' });
  });
  connection.end();
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});


// In the updated code, several measures have been implemented to mitigate the Injection Attacks vulnerability.
// The SQL query is constructed using a parameterized query approach by replacing the actual value with a placeholder ?.

// The user-supplied value is passed as an array of values in the connection.query() method, which ensures that the 
// value is properly escaped and prevents it from being interpreted as part of the SQL code.
// By using parameterized queries or prepared statements, you separate the SQL code from the user-supplied data, 
// effectively preventing injection attacks.


