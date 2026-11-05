
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "db.txt");

// Helper function to read and parse all todos
const readTodos = () => {
  const data = fs.readFileSync(dbPath, "utf8");

  if (!data.trim()) {
    return [];
  }

  return data.trim().split(/\n(?=\{)/).map((item) => JSON.parse(item));
};

// Helper function to write todos to db.txt
const writeTodos = (todos) => {
  const data = todos
    .map((todo) => JSON.stringify(todo, null, 2))
    .join("\n");

  fs.writeFileSync(dbPath, data);
};

// 1. Get all todos
const getTodosSync = () => {
  return fs.readFileSync(dbPath, "utf8");
};

// 2. Get a specific todo by ID
const getTodoSync = (id) => {
  const todos = readTodos();

  const todo = todos.find((todo) => todo.id === Number(id));

  if (!todo) {
    return null;
  }

  return JSON.stringify(todo);
};

// 3. Create a new todo
const createTodoSync = (todo) => {
  const newTodo = {
    id: Date.now(),
    title: todo,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  fs.appendFileSync(
    dbPath,
    (fs.existsSync(dbPath) && fs.readFileSync(dbPath, "utf8").length > 0
      ? "\n"
      : "") + JSON.stringify(newTodo, null, 2)
  );
};

// 4. Update an existing todo
const updateTodoSync = (id, updates) => {
  const todos = readTodos();

  const updatedTodos = todos.map((todo) => {
    if (todo.id === Number(id)) {
      return {
        ...todo,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    }

    return todo;
  });

  writeTodos(updatedTodos);
};

// 5. Delete a todo
const deleteTodoSync = (id) => {
  const todos = readTodos();

  const updatedTodos = todos.filter(
    (todo) => todo.id !== Number(id)
  );

  writeTodos(updatedTodos);
};

module.exports = {
  getTodosSync,
  getTodoSync,
  createTodoSync,
  updateTodoSync,
  deleteTodoSync
};
