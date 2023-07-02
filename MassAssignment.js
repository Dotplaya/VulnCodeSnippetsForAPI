// This code snippet demonstrates a simplified vulnerable implementation.
// DO NOT use this code in production environments.

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// User model
class User {
  constructor(id, name, isAdmin) {
    this.id = id;
    this.name = name;
    this.isAdmin = isAdmin;
  }
}

// Create a new user (accessible to all users)
app.post('/users', (req, res) => {
  const newUser = new User(req.body.id, req.body.name, req.body.isAdmin);
  res.json(newUser);
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// This code represents a simplified Node.js application that allows the creation of new users through a /users
//  endpoint.
// The code uses a basic User class to represent a user, with properties for id, name, and isAdmin (indicating whether
//      the user is an administrator).
// The vulnerability lies in the fact that the endpoint allows clients to provide values for all properties of the User
//  class, including isAdmin.
// This means that any client can set isAdmin to true and assign themselves administrative privileges, bypassing any
//  intended access controls

// Mitigation 

// This code snippet includes mitigation measures to address the Mass Assignment vulnerability.

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// User model
class User {
  constructor(id, name, isAdmin) {
    this.id = id;
    this.name = name;
    this.isAdmin = isAdmin || false; // Ensure default value is set to false
  }
}

// Create a new user (accessible to all users)
app.post('/users', (req, res) => {
  const { id, name } = req.body;

  // Only allow 'id' and 'name' to be set by clients
  const newUser = new User(id, name);
  res.json(newUser);
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// In the updated code, several measures have been implemented to mitigate the Mass Assignment vulnerability.
// The isAdmin property in the User class now has a default value of false. This ensures that a new user is not
//  assigned administrative privileges by default.
// When creating a new user, the code only allows the id and name properties to be set by clients, ignoring any 
// other properties included in the request body.
// By strictly controlling the properties that can be set by clients, you prevent them from bypassing intended 
// access controls and assigning themselves elevated privileges