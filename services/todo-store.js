import Datastore from 'nedb-promises'
import Todo from './todo.js'

export class TodoStore {
    constructor(db) {
        const options = process.env.DB_TYPE === "FILE" ? {filename: './data/todos.db', autoload: true} : {}
        this.db = db || new Datastore(options);
    }

    async add(duedate, description, priority, state) {
        const todo = new Todo(duedate, description, priority, state);
        return this.db.insert(todo);
    }

    async get(id) {
        return this.db.findOne({_id: id});
    }

    async update(id, duedate, description, priority, state) {
        await this.db.update({_id: id}, {$set: {"duedate": duedate,"description": description,"priority": priority ,"state": state}});
        return this.get(id);
    }

    async all(sortKey, sortDirection, filterKey, filterBy) {
        const direction = (sortDirection === "up" ? -1 : 1);
        if(filterKey === '')
            return this.db.find({}).sort(Object.assign(sortKey, {direction})).exec();
        return this.db.find(Object.assign(filterKey, {filterBy})).sort(Object.assign(sortKey, {direction})).exec();
    }
}

export const todoStore = new TodoStore();