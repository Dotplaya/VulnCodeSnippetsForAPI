// This code snippet demonstrates a simplified vulnerable implementation.
// DO NOT use this code in production environments.

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Insecure CORS configuration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Allow all methods
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers
  next();
});

// Insecure error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});


// This code represents a simplified Node.js application that includes a REST API.
// The vulnerable code snippet demonstrates two common security misconfigurations: insecure Cross-Origin
//  Resource Sharing (CORS) configuration and insecure error handling.
// The insecure CORS configuration (res.setHeader('Access-Control-Allow-Origin', '*')) allows requests from 
// any origin, potentially exposing sensitive data to unauthorized domains.
// The insecure error handling middleware (app.use((err, req, res, next) => { ... })) simply logs the error
//  to the console and sends a generic error response, potentially leaking sensitive information and failing
//   to handle errors securely

// Mitigation 

// This code snippet includes mitigation measures to address the Security Misconfiguration vulnerability.

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Secure CORS configuration
app.use((req, res, next) => {
  const allowedOrigins = ['https://example.com']; // Define the allowed origins
  const requestOrigin = req.headers.origin;

  if (allowedOrigins.includes(requestOrigin)) {
    res.setHeader('Access-Control-Allow-Origin', requestOrigin); // Allow only specific origins
  } else {
    res.setHeader('Access-Control-Allow-Origin', ''); // Disallow other origins by not setting the header
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Include this header when using credentials (e.g., cookies)

  next();
});

// Secure error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// In the updated code, several measures have been implemented to mitigate the Security Misconfiguration vulnerability.
// The CORS configuration is updated to allow requests only from specific origins defined in the allowedOrigins array.
//  If the request's origin is included in the allowed list, it is set in the Access-Control-Allow-Origin header. 
//  Otherwise, the header is not set, effectively disallowing requests from unauthorized origins.
// The Access-Control-Allow-Credentials header is added to indicate that credentials (e.g., cookies) can be included
//  in cross-origin requests. Only include this header when necessary.
// The error handling middleware remains the same in this example, but in a real-world scenario, you should 
// implement proper error handling based on your application's requirements and securely handle any sensitive
//  information