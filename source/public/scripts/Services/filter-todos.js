function FilterTodos(Todos, key, filterby){
    let filteredArray;
    if (key === 'state'){
        filteredArray = Todos.filter((el) => filterby.indexOf(el.state) >= 0); 
    }
    return filteredArray;
}
