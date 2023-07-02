// This code snippet demonstrates a simplified vulnerable implementation.
// DO NOT use this code in production environments.

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let users = [
  { id: 1, username: 'admin', password: 'admin' },
  { id: 2, username: 'user1', password: 'password1' },
];

// Insecure implementation of user authentication
const authenticateUser = (req, res, next) => {
  const { username, password } = req.headers;

  if (!username || !password) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Insecure: Relies solely on username and password for authentication
  req.user = user;

  next();
};

// Get user profile (accessible to authenticated users)
app.get('/profile', authenticateUser, (req, res) => {
  const user = req.user;
  res.json(user);
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});


// This code represents a simplified Node.js application that provides an endpoint to retrieve a user's profile information.
// The authentication mechanism relies on user-provided username and password headers, which is insecure as it transmits
//  sensitive information in plain text and does not provide strong authentication.
// In this implementation, the user's profile is returned if the provided username and password match the credentials
//  stored in the users array.
// However, this approach has multiple vulnerabilities:
//     The username and password headers are sent in plain text, making it susceptible to interception and eavesdropping.

//     The password is stored in plain text, making it vulnerable to unauthorized access if the user database is 
//     compromised.
//     The implementation lacks essential security measures such as salting and hashing passwords, enforcing strong
//      password policies, session management, etc.
// These vulnerabilities violate the secure user authentication principles outlined in the OWASP API Top 10.

// Mitigation 

// This code snippet includes mitigation measures to address the Broken User Authentication vulnerability.

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());

let users = [
  { id: 1, username: 'admin', password: '$2b$10$1Jz6tqVs3MN.JrDbInMbMOhYpRo75FSuvlzT3Bz69syvWYR/ah4J2' }, // Hashed password: "admin"
  { id: 2, username: 'user1', password: '$2b$10$qmCWeQaVbStKv6FCPYV4KeDncf8c5flKna30R3c9/8o/T5FkYsY36' }, // Hashed password: "password1"
];

const saltRounds = 10;

// Secure implementation of user authentication
const authenticateUser = (req, res, next) => {
  const { username, password } = req.headers;

  if (!username || !password) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = users.find((u) => u.username === username);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (result) {
      // Secure: Authentication successful
      req.user = user;
      next();
    } else {
      // Secure: Authentication failed
      res.status(401).json({ error: 'Unauthorized' });
    }
  });
};

// Get user profile (accessible to authenticated users)
app.get('/profile', authenticateUser, (req, res) => {
  const user = req.user;
  res.json(user);
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// In the updated code, several measures have been implemented to mitigate the Broken User Authentication vulnerability.
// Instead of storing plain-text passwords, the passwords are securely hashed using the bcrypt library.
// During authentication, the stored hashed password is compared with the input password using the bcrypt.compare 
// function, which securely verifies the password's correctness.
// This ensures that even if the user database is compromised, the passwords remain secure and cannot be easily
//  reversed or exploited.
// The updated code implements a more secure authentication mechanism by using strong password hashing, which helps 
// prevent unauthorized access to user accounts.
// Additionally, make sure to follow other best practices for user authentication and session management, such as
//  using secure protocols (HTTPS), implementing account lockout mechanisms, enforcing password complexity rules,
//   and using secure session management techniques