export default function SortTodos(Todos, key, direction){
    let sortedData;
    if(direction === "down"){
      if(key === 'Beschreibung'){
        sortedData = Todos.sort((a,b)=> {
          const x = a.description.toLowerCase();
          const y = b.description.toLowerCase();
          if(x>y){return 1;}
          if(x<y){return -1;}
          return 0;
        });
        
      }
      else if(key === 'Status') {
        sortedData = Todos.sort((a,b)=> {
          const x = a.state.toLowerCase();
          const y = b.state.toLowerCase();
          if(x>y){return 1;}
          if(x<y){return -1;}
          return 0;
        });
      }
      else if(key === 'Priorität') {
        sortedData = Todos.sort((a,b)=> a.priority - b.priority);
      }
      else if(key === 'Stichtag') {
        sortedData = Todos.sort((a,b)=>(new Date(a.duedate) - new Date(b.duedate)));
      }
      else if(key === 'id') {
        sortedData = Todos.sort((a,b)=> a.id - b.id);
      }
      else{
        sortedData = Todos.sort((a,b)=> a.id - b.id);
      }
    }
    else if (direction === 'up'){
      if(key === 'Beschreibung'){
        sortedData = Todos.sort((a,b)=> {
          const x = a.description.toLowerCase();
          const y = b.description.toLowerCase();
          if(x>y){return -1;}
          if(x<y){return 1;}
          return 0;
        });
      }
      else if(key === 'Status') {
        sortedData = Todos.sort((a,b)=> {
          const x = a.state.toLowerCase();
          const y = b.state.toLowerCase();
          if(x>y){return -1;}
          if(x<y){return 1;}
          return 0;
        });
      }
      else if(key === 'Priorität') {
        sortedData = Todos.sort((a,b)=> b.priority - a.priority);
      }
      else if(key === 'Stichtag') {
        sortedData = Todos.sort((a,b)=>(new Date(b.duedate) - new Date(a.duedate)));
      }
      else if(key === 'id') {
        sortedData = Todos.sort((a,b)=> b.id - a.id);
      }
      else{
        sortedData = Todos.sort((a,b)=> a.id - b.id);
      }
    }

    return sortedData;
}
