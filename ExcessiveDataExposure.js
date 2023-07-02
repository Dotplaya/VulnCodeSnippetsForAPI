// This code snippet demonstrates a simplified vulnerable implementation.
// DO NOT use this code in production environments.

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let users = [
  { id: 1, username: 'admin', email: 'admin@example.com' },
  { id: 2, username: 'user1', email: 'user1@example.com' },
];

// Get user profile (accessible to authenticated users)
app.get('/profile/:id', (req, res) => {
  const { id } = req.params;

  // Insecure: Exposes excessive user data, including email
  const user = users.find((u) => u.id === parseInt(id));

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// This code represents a simplified Node.js application that provides an endpoint to retrieve a user's profile
//  information.
// When a GET request is made to /profile/:id, the user's profile is returned, including sensitive information such
//  as the user's email.
// This implementation exposes excessive data by providing the user's email to anyone who has the user's ID, without 
// proper authorization checks.
// Exposing excessive user data can lead to privacy breaches and expose sensitive information to unauthorized 
// individuals.
// This violates the principle of limiting data exposure as outlined in the OWASP API Top 10.

// Mitigation 

// This code snippet includes mitigation measures to address the Excessive Data Exposure vulnerability.

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let users = [
  { id: 1, username: 'admin', email: 'admin@example.com' },
  { id: 2, username: 'user1', email: 'user1@example.com' },
];

// Get user profile (accessible to authenticated users)
app.get('/profile/:id', authenticateUser, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  // Mitigation: Check if the authenticated user is authorized to access the profile
  if (userId !== parseInt(id)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const user = users.find((u) => u.id === parseInt(id));

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  // Mitigation: Return only necessary and authorized user data (e.g., excluding email)
  const { username } = user;
  const userProfile = { id: user.id, username };

  res.json(userProfile);
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// In the updated code, several measures have been implemented to mitigate the Excessive Data Exposure vulnerability.
// The authenticateUser function is used as middleware to ensure that the user is authenticated before accessing 
// the profile.
// After authenticating the user, an authorization check is performed to verify if the authenticated user is 
// authorized to access the requested profile.
// Only if the authenticated user's ID matches the requested profile ID, the user's profile data is returned.
// The mitigation involves returning only necessary and authorized user data, such as excluding sensitive information 
// like the user's email.
// By implementing proper authorization checks and limiting the exposed user data, you can prevent excessive exposure 
// of sensitive information and ensure that users can only access the necessary data they are authorized to view.