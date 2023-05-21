
const Todos = [
  {id: '01', duedate: "2027-05-08", description: 'putzen', priority: 1, state: "erledigt"},
  {id: '02', duedate: "2027-05-09", description: 'aufräumen', priority: 4, state: "erledigt"},
  {id: '03', duedate: "2027-05-10", description: 'waschen', priority: 3, state: "offen"},
  {id: '04', duedate: "2027-05-11", description: 'Müll', priority: 2, state: "erledigt"},
  {id: '05', duedate: "2027-05-12", description: 'bla', priority: 2, state: "erledigt"},
];

const themeButton = document.getElementById("theme-button");
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});


function initApp () {

  const songsDivElement = document.querySelector("#Todos");

  function createTodosHTML(list) {
    return list.map(Todo =>
      `<li class = "todo">
          <p class = "duedate">
          ${String(new Date(Todo.duedate).getUTCDate()).padStart(2,'0')}.${String(new Date(Todo.duedate).getMonth()+1).padStart(2,'0')}.${new Date(Todo.duedate).getUTCFullYear()}
          </p>
          <p class = "description">
            ${Todo.description}
          </p>
          <p class = "priority">
            ${Todo.priority}
          </p>
          <p class = "state">
            ${Todo.state}
          </p>
          <p class = "edit">
            <button data-todo-id="${Todo.id}">Editieren</button>
          </p>
        </li>`
        ).join('');
  }

  function on() {
    document.getElementById("overlay").style.display = "block";
  }
  
  function off() {
    document.getElementById("overlay").style.display = "none";
  }


  function renderTodos() {
    songsDivElement.innerHTML = createTodosHTML(Todos);
  }

  function findTodo(id) {
    return Todos.find((foundTodo) => parseInt(id, 10) === parseInt(foundTodo.id, 10));
  }

  function findTodoIndex(id) {
    return Todos.findIndex((foundTodo) => parseInt(id, 10) === parseInt(foundTodo.id, 10));
  }

  function bubbledClickEventHandler(event) {
    // takes advantage of event bubbling
    const buttonTodoId = event.target.dataset.todoId;
    if (buttonTodoId) {
      const Todo = findTodo(buttonTodoId);
      const overlayType = document.querySelector(".overlay-send");
      overlayType.dataset.overlayId = Todo.id;
      const FormContent = document.getElementById("form-content");
      const content = `
      <label for="description">Beschreibung</label>
      <textarea id="description" name="description" required>${String(Todo.description)}</textarea>

      <br />

      <label for="importance">Priorität</label>
      <select name="importance" id="importance" value=${Todo.priority} required>
        <option value="">Bitte wählen sie eine Priorität aus</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>

      <br />

      <label for="duedate">Stichtag</label>
      <input id="duedate" type="date" name="duedate" value = ${String(Todo.duedate)} required/>

      <br />

      <div id="state-checkbox">
        <input id="state" type="checkbox" name="state" value="done">
        <label for="state">Erledigt</label>
      </div> 
      `;
      FormContent.innerHTML = content;
      const select = document.querySelector('#importance');
      const options = Array.from(select.options);
      const optionToSelect = options.find(item => item.text === String(Todo.priority));
      optionToSelect.selected = true;
      const status = Todo.state==="erledigt";
      const state = document.querySelector('#state');
      state.checked = status;
      on()
    }
  }


  


  
  const createTodo = document.getElementById("create-todo");
  createTodo.addEventListener("click", () => {
    const overlayType = document.querySelector(".overlay-send");
    overlayType.dataset.overlayId = 0;
    const FormContent = document.getElementById("form-content");
    const content = `
    <label for="description">Beschreibung</label>
    <textarea id="description" name="description" required></textarea>

    <br />

    <label for="importance">Priorität</label>
    <select name="importance" id="importance" required>
      <option value="">Bitte wählen sie eine Priorität aus</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
    </select>

    <br />

    <label for="duedate">Stichtag</label>
    <input id="duedate" type="date" name="duedate" required/>

    <br />

    <div id="state-checkbox">
      <input id="state" type="checkbox" name="state" value="done">
      <label for="state">Erledigt</label>
    </div> 
    `;
    FormContent.innerHTML = content;
    on()
  });

  const OverlayClose = document.getElementById("overlay-close");
  OverlayClose.addEventListener("click", () => {off();})

  const form = document.getElementById("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const description = document.getElementById("description");
    const importance = document.getElementById("importance");
    const duedate = document.getElementById("duedate");
    const state = document.getElementById("state").checked;
    const arayId = Todos.length + 1;
    const status = (state===false ? "offen": "erledigt");
    const overlayType = document.querySelector(".overlay-send");
    const input = {id: arayId, duedate: duedate.value, description: description.value, priority: importance.value, state: status};
    if(parseInt(overlayType.dataset.overlayId,10) === 0){
      Todos.push(input);
    }
    else{
      const TodoIndex = findTodoIndex(overlayType.dataset.overlayId)
      Todos[TodoIndex] = input;

    }
    off()
    renderTodos();
  });  



  renderTodos();
  songsDivElement.addEventListener("click", bubbledClickEventHandler);
}





export default {initApp};

