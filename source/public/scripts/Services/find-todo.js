  function findTodo(id,Todos) {
    return Todos.find((foundTodo) => parseInt(id, 10) === parseInt(foundTodo.id, 10));
  }