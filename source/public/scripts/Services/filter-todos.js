export default function FilterTodos(Todos, key, filterby){
    let filteredArray;
    if (key === 'done' && !(filterby === 'none')){
        filteredArray = Todos.filter((el) => filterby.indexOf(el.state) >= 0); 
    }
    else if (key === 'open' && !(filterby === 'none')){
        filteredArray = Todos.filter((el) => filterby.indexOf(el.state) >= 0); 
    }
    else{
        filteredArray = Todos;
    }
    return filteredArray;
}