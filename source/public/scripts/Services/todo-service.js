import { httpService } from './http-service.js'

class TodoService {
    // eslint-disable-next-line class-methods-use-this
    async createTodo(todoDuedate, todoDescription, todoPriority , todoState) {
        return httpService.ajax("POST", "/todos/", {duedate: todoDuedate, description: todoDescription, priority: todoPriority , state: todoState});
    }

    // eslint-disable-next-line class-methods-use-this
    async getTodos(sortKey, sortDirection, filterKey, filterBy) {
        return httpService.ajax("GET", `/todos/sortFilter?sortKey=${sortKey}&sortDirection=${sortDirection}&filterKey=${filterKey}&filterBy=${filterBy}`, undefined);
    }

    // eslint-disable-next-line class-methods-use-this
    async getTodo(id) {
        return httpService.ajax("GET", `/todos/${id}`, undefined);
    }

    // eslint-disable-next-line class-methods-use-this
    async changeTodo(_id, duedate, description, priority , state) {
        return httpService.ajax("POST", `/todos/${_id}`, {duedate, description, priority , state});
    }
}

// eslint-disable-next-line import/prefer-default-export
export const todoService = new TodoService();