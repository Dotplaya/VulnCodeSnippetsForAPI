// This code snippet demonstrates a simplified vulnerable implementation.
// DO NOT use this code in production environments.

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let isAdmin = false;

// Update user role (accessible to authenticated users)
app.post('/updateRole', (req, res) => {
  const { role } = req.body;

  if (role === 'admin') {
    // Insecure: Allows any authenticated user to become an admin
    isAdmin = true;
    res.json({ message: 'User role updated to admin' });
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
});

// Perform admin-only operation (accessible only to admins)
app.get('/adminOperation', (req, res) => {
  if (isAdmin) {
    res.json({ message: 'Admin operation successful' });
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// This code represents a simplified Node.js application that includes functionality for updating user roles and
//  performing admin-only operations.
// The /updateRole endpoint allows any authenticated user to update their role to "admin" by providing the 
// desired role in the request body.
// The /adminOperation endpoint is intended to be accessible only to users with an "admin" role.
// However, the implementation lacks proper authorization checks and allows any authenticated user to become an 
// admin by setting their role to "admin".
// This vulnerability violates the principle of Broken Function Level Authorization as outlined in the OWASP API 
// Top 10

// Mitigation

// This code snippet includes mitigation measures to address the Broken Function Level Authorization vulnerability.

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let isAdmin = false;

// Update user role (accessible to authenticated users with admin role)
app.post('/updateRole', requireAdminRole, (req, res) => {
  const { role } = req.body;

  // In a real application, you may have a more robust logic to handle role updates

  res.json({ message: 'User role updated successfully' });
});

// Perform admin-only operation (accessible only to admins)
app.get('/adminOperation', requireAdminRole, (req, res) => {
  res.json({ message: 'Admin operation successful' });
});

// Middleware to check if the user has the admin role
function requireAdminRole(req, res, next) {
  if (isAdmin) {
    next(); // Proceed to the next middleware/route handler
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
}

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});


// In the updated code, several measures have been implemented to mitigate the Broken Function Level Authorization 
// vulnerability.
// A middleware function requireAdminRole is added to check if the user has the admin role before allowing access to
//  the /updateRole and /adminOperation endpoints.
// The requireAdminRole middleware is invoked before the route handler for the respective endpoints. If the user is 
// an admin (isAdmin is true), the middleware allows the request to proceed to the next middleware or route handler.
//  Otherwise, a 403 Forbidden response is sent.
// By implementing this middleware, the code enforces proper authorization checks to ensure that only users with the 
// admin role can access the sensitive functionality.
// The implementation assumes that you have a more robust mechanism to handle role updates, but this simplified example
//  focuses on the authorization check itself.

