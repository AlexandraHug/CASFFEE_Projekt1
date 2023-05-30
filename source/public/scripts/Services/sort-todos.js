export default function SortTodos(Todos, key, direction){
    let sortedData;
    if(direction === "down"){
      if(key === 'description'){
        sortedData = Todos.sort((a,b)=> {
          const x = a.description.toLowerCase();
          const y = b.description.toLowerCase();
          if(x>y){return 1;}
          if(x<y){return -1;}
          return 0;
        });
        
      }
      else if(key === 'state') {
        sortedData = Todos.sort((a,b)=> {
          const x = a.state.toLowerCase();
          const y = b.state.toLowerCase();
          if(x>y){return 1;}
          if(x<y){return -1;}
          return 0;
        });
      }
      else if(key === 'priority') {
        sortedData = Todos.sort((a,b)=> a.priority - b.priority);
      }
      else if(key === 'date') {
        sortedData = Todos.sort((a,b)=>(new Date(a.duedate) - new Date(b.duedate)));
      }
      else{
        sortedData = Todos;
      }
    }
    else if (direction === 'up'){
      if(key === 'description'){
        sortedData = Todos.sort((a,b)=> {
          const x = a.description.toLowerCase();
          const y = b.description.toLowerCase();
          if(x>y){return -1;}
          if(x<y){return 1;}
          return 0;
        });
      }
      else if(key === 'state') {
        sortedData = Todos.sort((a,b)=> {
          const x = a.state.toLowerCase();
          const y = b.state.toLowerCase();
          if(x>y){return -1;}
          if(x<y){return 1;}
          return 0;
        });
      }
      else if(key === 'priority') {
        sortedData = Todos.sort((a,b)=> b.priority - a.priority);
      }
      else if(key === 'date') {
        sortedData = Todos.sort((a,b)=>(new Date(b.duedate) - new Date(a.duedate)));
      }
      else{
        sortedData = Todos;
      }
    }

    return sortedData;
}
