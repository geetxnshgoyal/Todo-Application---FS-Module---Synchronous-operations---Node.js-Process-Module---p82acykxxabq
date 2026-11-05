const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "db.txt");

const readTodos = () => {
  const data = fs.readFileSync(dbPath, "utf8");

  if (!data.trim()) {
    return [];
  }

  const todos = [];
  let objectStart = -1;
  let objectDepth = 0;
  let insideString = false;
  let escaped = false;

  for (let index = 0; index < data.length; index += 1) {
    const character = data[index];

    if (insideString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        insideString = false;
      }
      continue;
    }

    if (character === '"') {
      insideString = true;
    } else if (character === "{") {
      if (objectDepth === 0) {
        objectStart = index;
      }
      objectDepth += 1;
    } else if (character === "}") {
      objectDepth -= 1;
      if (objectDepth === 0) {
        todos.push(JSON.parse(data.slice(objectStart, index + 1)));
      }
    }
  }

  return todos;
};

const writeTodos = (todos) => {
  const data = todos
    .map((todo) => JSON.stringify(todo, null, 2))
    .join("\n");

  fs.writeFileSync(dbPath, data);
};

const getTodosSync = () => {
  return fs.readFileSync(dbPath, "utf8");
};

const getTodoSync = (id) => {
  const todos = readTodos();
  const todo = todos.find((todo) => todo.id === Number(id));

  if (!todo) {
    return null;
  }

  return JSON.stringify(todo);
};

const createTodoSync = (todo) => {
  const newTodo = {
    id: Date.now(),
    title: todo,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  fs.appendFileSync(
    dbPath,
    (fs.existsSync(dbPath) && fs.readFileSync(dbPath, "utf8").length > 0
      ? "\n"
      : "") + JSON.stringify(newTodo, null, 2),
  );
};

const updateTodoSync = (id, updates) => {
  const todos = readTodos();

  const updatedTodos = todos.map((todo) => {
    if (todo.id === Number(id)) {
      return {
        ...todo,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    }

    return todo;
  });

  writeTodos(updatedTodos);
};

const deleteTodoSync = (id) => {
  const todos = readTodos();

  const updatedTodos = todos.filter(
    (todo) => todo.id !== Number(id),
  );

  writeTodos(updatedTodos);
};

module.exports = {
  getTodosSync,
  getTodoSync,
  createTodoSync,
  updateTodoSync,
  deleteTodoSync,
};
