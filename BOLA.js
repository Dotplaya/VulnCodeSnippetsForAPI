// This code snippet demonstrates a simplified vulnerable implementation.
// DO NOT use this code in production environments.

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let todos = [];

// Insecure implementation of user authentication
const authenticateUser = (req, res, next) => {
  const { userId } = req.headers;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Assume user with ID 1 is an administrator
  if (userId !== '1') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
};

// Get all todos (accessible to authenticated users)
app.get('/todos', authenticateUser, (req, res) => {
  res.json(todos);
});

// Create a new todo (accessible to authenticated users)
app.post('/todos', authenticateUser, (req, res) => {
  const { title, description } = req.body;

  const newTodo = {
    id: todos.length + 1,
    title,
    description,
    userId: req.headers.userId, // Insecure: Relies on user-provided header
  };

  todos.push(newTodo);

  res.json(newTodo);
});

// Get a specific todo (accessible to authenticated users)
app.get('/todos/:id', authenticateUser, (req, res) => {
  const { id } = req.params;

  const todo = todos.find((t) => t.id === parseInt(id));

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

// Update a specific todo (accessible to authenticated users)
app.put('/todos/:id', authenticateUser, (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const todo = todos.find((t) => t.id === parseInt(id));

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // Insecure: Allows any authenticated user to modify any todo
  todo.title = title;
  todo.description = description;

  res.json(todo);
});

// Delete a specific todo (accessible to authenticated users)
app.delete('/todos/:id', authenticateUser, (req, res) => {
  const { id } = req.params;

  const todoIndex = todos.findIndex((t) => t.id === parseInt(id));

  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  // Insecure: Allows any authenticated user to delete any todo
  todos.splice(todoIndex, 1);

  res.sendStatus(204);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});


// This code represents a simplified Node.js application that provides CRUD operations for managing todos.
// The authentication mechanism relies on a user-provided userId header, which is insecure as it can be easily
//  manipulated by the user.
// In this implementation, any user with an authenticated userId can perform any operation on any todo, allowing 
// them to access or modify todos that don't belong to them.
// This violates the Object Level Authorization, as the application does not enforce proper authorization checks
//  to ensure that users can only access and modify their own todos.

// Mitigation 

// This code snippet includes mitigation measures to address the BOLA vulnerability.

// ...

// Create a new todo (accessible to authenticated users)
app.post('/todos', authenticateUser, (req, res) => {
    const { title, description } = req.body;
    const userId = req.headers.userId;
  
    const newTodo = {
      id: todos.length + 1,
      title,
      description,
      userId,
    };
  
    todos.push(newTodo);
  
    res.json(newTodo);
  });
  
  // Get a specific todo (accessible to authenticated users)
  app.get('/todos/:id', authenticateUser, (req, res) => {
    const { id } = req.params;
    const userId = req.headers.userId;
  
    const todo = todos.find((t) => t.id === parseInt(id));
  
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
  
    // Mitigation: Check if the user is authorized to access the todo
    if (todo.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  
    res.json(todo);
  });
  
  // Update a specific todo (accessible to authenticated users)
  app.put('/todos/:id', authenticateUser, (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = req.headers.userId;
  
    const todo = todos.find((t) => t.id === parseInt(id));
  
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
  
    // Mitigation: Check if the user is authorized to update the todo
    if (todo.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  
    todo.title = title;
    todo.description = description;
  
    res.json(todo);
  });
  
  // Delete a specific todo (accessible to authenticated users)
  app.delete('/todos/:id', authenticateUser, (req, res) => {
    const { id } = req.params;
    const userId = req.headers.userId;
  
    const todoIndex = todos.findIndex((t) => t.id === parseInt(id));
  
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }
  
    const todo = todos[todoIndex];
  
    // Mitigation: Check if the user is authorized to delete the todo
    if (todo.userId !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  
    todos.splice(todoIndex, 1);
  
    res.sendStatus(204);
  });
  
  // ...

//   In the updated code, additional checks have been implemented to ensure that users can only access and modify their own todos.
//   When creating a new todo, the userId is retrieved from the authenticated user's headers and associated with the todo.
//   When retrieving, updating, or deleting a todo, the userId is compared with the userId associated with the todo.
//   If the userId does not match, a 403 Forbidden response is sent, indicating that the user is not authorized to perform the operation on that specific todo.
//   These authorization checks help mitigate the BOLA vulnerability by enforcing proper object-level authorization, ensuring that users can only access and modify their own todos.
