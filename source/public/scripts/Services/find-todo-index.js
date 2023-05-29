function findTodoIndex(id, Todos) {
    return Todos.findIndex((foundTodo) => parseInt(id, 10) === parseInt(foundTodo.id, 10));
  }