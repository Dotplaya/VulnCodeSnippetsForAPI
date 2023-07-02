// This code snippet demonstrates a simplified vulnerable implementation.
// DO NOT use this code in production environments.

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let todos = [];

// Get all todos (accessible to all users)
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Create a new todo (accessible to all users)
app.post('/todos', (req, res) => {
  const { title, description } = req.body;

  const newTodo = {
    id: todos.length + 1,
    title,
    description,
  };

  todos.push(newTodo);

  res.json(newTodo);
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// This code represents a simplified Node.js application that provides endpoints for managing todos.
// The /todos endpoint allows users to retrieve all todos and create new todos.
// However, this implementation lacks proper resource allocation and rate limiting mechanisms.
// The lack of resource management can lead to resource exhaustion if an excessive number of requests are made to
//  retrieve or create todos.
// Additionally, the absence of rate limiting allows attackers to abuse the API by overwhelming it with a large number
//  of requests, potentially causing denial-of-service (DoS) attacks or disrupting the service for legitimate users.
// These vulnerabilities violate the principle of resource and rate limiting as outlined in the OWASP API Top 10

// Mitigation

// This code snippet includes mitigation measures to address the Lack of Resources and Rate Limiting vulnerability.

const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(bodyParser.json());

let todos = [];

// Apply rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit to 100 requests per windowMs
});
app.use(limiter);

// Get all todos (accessible to all users)
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Create a new todo (accessible to all users)
app.post('/todos', (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description are required' });
  }

  if (todos.length >= 1000) {
    return res.status(429).json({ error: 'Too many todos' });
  }

  const newTodo = {
    id: todos.length + 1,
    title,
    description,
  };

  todos.push(newTodo);

  res.json(newTodo);
});

// ...

app.listen(3000, () => {
  console.log('Server started on port 3000');
});


// In the updated code, several measures have been implemented to mitigate the Lack of Resources and Rate Limiting
//  vulnerability.
// The express-rate-limit middleware is used to apply rate limiting. In this example, the rate limit is set to a 
// maximum of 100 requests per 15 minutes (windowMs).
// When the rate limit is exceeded, the middleware automatically responds with a 429 Too Many Requests status code,
//  indicating that the user has made too many requests within the specified time frame.
// To prevent excessive resource allocation, a check is added before creating a new todo to ensure that the total 
// number of todos does not exceed a certain limit (e.g., 1000 in this example). If the limit is reached, a 429 Too
//  Many Requests status code is returned to indicate that too many todos have been created.
// Additionally, a check is added to validate that the title and description are provided when creating a new todo.
//  If they are missing, a 400 Bad Request status code is returned with an error message.
// By implementing rate limiting and resource allocation checks, you can ensure that the API is protected 
// from excessive resource usage, abuse, and potential DoS attacks