import {todoStore} from '../services/todo-store.js'

export class TodosController {
    
    async getTodos (req, res) {
        res.json((await todoStore.all(req.query.sortKey, req.query.sortDirection, req.query.filterKey, req.query.filterBy) || []))
    };

    async createTodo (req, res) {
        res.json(await todoStore.add(req.body.duedate, req.body.description, req.body.priority, req.body.state ));
    };

    async showTodo (req, res) {
        res.json(await todoStore.get(req.params.id));
    };

    async changeTodo (req, res) {
        res.json(await todoStore.update(req.params.id, req.body.duedate, req.body.description, req.body.priority, req.body.state )); // TODO should return 402 if not ok
    };
}

export const todosController = new TodosController();