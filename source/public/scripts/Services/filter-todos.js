export default function FilterTodos(Todos, key, filterby){
    let filteredArray;
    if (key === 'state' && !(filterby === 'none')){
        filteredArray = Todos.filter((el) => filterby.indexOf(el.state) >= 0); 
    }
    else{
        filteredArray = Todos;
    }
    return filteredArray;
}