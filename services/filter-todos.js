export default function FilterTodos(Todos, key, filterby){
    let filteredArray;
    if (key === 'done' && !(filterby === '')){
        filteredArray = Todos.filter((el) => filterby.indexOf(el.state) >= 0); 
    }
    else if (key === 'open' && !(filterby === '')){
        filteredArray = Todos.filter((el) => filterby.indexOf(el.state) >= 0); 
    }
    else{
        filteredArray = Todos;
    }
    return filteredArray;
}