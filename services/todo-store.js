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
        return this.db.findOne({_id: id}).exec();
    }

    async update(id, duedate, description, priority, state) {
        await this.db.update({_id: id}, {$set: {"Stichtag": duedate,"Beschreibung": description,"Priorität": priority ,"Status": state}});
        return this.get(id);
    }

    async all(sortKey, sortDirection, filterKey, filterBy) {
        const direction = (sortDirection === "up" ? -1 : 1);
        const sortOption = {};
        if (sortKey === 'none')
            // eslint-disable-next-line no-underscore-dangle
            sortOption.addDate = -1;
        else
            sortOption[sortKey] = direction;

        if(filterBy === 'none'){
            return this.db.find({}).sort(sortOption).exec();
        }
        const filterOptions = {};
        filterOptions[filterKey] = filterBy;
        return this.db.find(filterOptions).sort(sortOption).exec();
    }
}

export const todoStore = new TodoStore();