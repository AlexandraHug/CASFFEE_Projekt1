const TodosFirstList = [
  {id: 1, duedate: "2027-05-08", description: 'putzen', priority: 1, state: "erledigt"},
  {id: 2, duedate: "2027-05-09", description: 'aufräumen', priority: 4, state: "erledigt"},
  {id: 3, duedate: "2027-05-10", description: 'waschen', priority: 3, state: "offen"},
  {id: 4, duedate: "2027-05-11", description: 'Müll', priority: 2, state: "erledigt"},
  {id: 5, duedate: "2027-05-12", description: 'bla', priority: 2, state: "erledigt"},
];

const themeButton = document.getElementById("theme-button");
themeButton.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
}

const OverlayClose = document.getElementById("overlay-close");
OverlayClose.addEventListener("click", () => {off();})

function initApp () {

  const songsDivElement = document.querySelector("#Todos");
  // const Todos = JSON.parse(localStorage.getItem('Todos') === undefined ? TodosFirstList : localStorage.getItem('Todos'));
  let Todos = JSON.parse(localStorage.getItem('Todos') || "[]");
  if (Todos.length === 0)
    {Todos = TodosFirstList;}
  localStorage.setItem('Todos', JSON.stringify(Todos));

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

  function renderTodos(TodosList) {
    songsDivElement.innerHTML = createTodosHTML(TodosList);
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

  function bubbledClickEventHandler(event) {
    // takes advantage of event bubbling
    const buttonTodoId = event.target.dataset.todoId;
    if (buttonTodoId) {
      const Todo = findTodo(buttonTodoId, Todos);
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
      on();
    }
  }

  const form = document.getElementById("form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const overlayType = document.querySelector(".overlay-send");
    const description = document.getElementById("description");
    const importance = document.getElementById("importance");
    const duedate = document.getElementById("duedate");
    const state = document.getElementById("state").checked;
    const arayId = (parseInt(overlayType.dataset.overlayId,10) === 0 ? Todos.length + 1 : parseInt(overlayType.dataset.overlayId,10));
    const status = (state===false ? "offen": "erledigt");
    const input = {id: arayId, duedate: duedate.value, description: description.value, priority: importance.value, state: status};
    if(parseInt(overlayType.dataset.overlayId,10) === 0){
      Todos.push(input);
      localStorage.setItem('Todos',JSON.stringify(Todos));
    }
    else{
      const TodoIndex = findTodoIndex(overlayType.dataset.overlayId, Todos)
      Todos[TodoIndex] = input;
      localStorage.setItem('Todos',JSON.stringify(Todos));

    }
    off()
    renderTodos(Todos);
  });  

  const SortByDescription = document.getElementById("sort-description");
  SortByDescription.addEventListener("click", () => {
    const SortedTodos = SortTodos(Todos, "description");
    renderTodos(SortedTodos);
  });

  const SortByPriority = document.getElementById("sort-priority");
  SortByPriority.addEventListener("click", () => {
    const SortedTodos = SortTodos(Todos, "priority");
    renderTodos(SortedTodos);
  });

  const SortByState = document.getElementById("sort-state");
  SortByState.addEventListener("click", () => {
    const SortedTodos = SortTodos(Todos, "state");
    renderTodos(SortedTodos);
  });

  const SortByDate = document.getElementById("sort-date");
  SortByDate.addEventListener("click", () => {
    const SortedTodos = SortTodos(Todos, "date");
    renderTodos(SortedTodos);
  });

  const FilterByDone = document.getElementById("filter-done");
  FilterByDone.addEventListener("click", () => {
    if(parseInt(FilterByDone.dataset.filtered,10) === 0){
      FilterByDone.dataset.filtered = 1;
      const FilteredTodos = FilterTodos(Todos, "state", "erledigt");
      renderTodos(FilteredTodos);
    }
    else{
      FilterByDone.dataset.filtered = 0;
      renderTodos(Todos);
    }
  });

  renderTodos(Todos);
  songsDivElement.addEventListener("click", bubbledClickEventHandler);
}

initApp();

