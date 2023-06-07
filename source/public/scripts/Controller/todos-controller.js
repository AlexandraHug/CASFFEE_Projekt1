import FilterTodos  from '../Services/filter-todos.js';
import SortTodos  from '../Services/sort-todos.js';
import findTodo  from '../Services/find-todo.js';
import findTodoIndex  from '../Services/find-todo-index.js';
import toggleValue  from '../Services/toggle-string.js';

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
  const todosDivElement = document.querySelector("#Todos");
  const FilterFunction = document.querySelector(".listFilter");
  const SortFunction = document.querySelector(".listSort");
  
  let Todos = JSON.parse(localStorage.getItem('Todos') || "[]");
  if (Todos.length === 0)
    {Todos = TodosFirstList;}
  localStorage.setItem('Todos', JSON.stringify(Todos));

  function createTodosHTML(list) {
    const SortFunctionForHtml = document.querySelector(".listSort");
    const Sortkey = SortFunctionForHtml.dataset.sortFunction;
    const direction = SortFunctionForHtml.dataset.sortDirection;
    const SortedList = SortTodos(list, Sortkey, direction);
    const FilterFunctionForHtml = document.querySelector(".listFilter");
    const Filterkey =  FilterFunctionForHtml.dataset.filterFunction;
    const filterby = FilterFunctionForHtml.dataset.filterString;
    const FilteredList = FilterTodos(SortedList, Filterkey, filterby);
    return FilteredList.map(Todo =>
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

  function getArrow(sortString){
    let SortSign;
    if(SortFunction.dataset.sortFunction === sortString){
      SortSign = (SortFunction.dataset.sortDirection === "up" ? "&#x25b2" : "&#x25bc" );
    }
    else{
      SortSign = "";
    }
    return SortSign;
  }

  function getButtonPressed(PressedString){
    let ButtonPressedClass;
    if(SortFunction.dataset.sortFunction === PressedString || (FilterFunction.dataset.filterFunction === PressedString && !(FilterFunction.dataset.filterString === "none"))){
      ButtonPressedClass = "class = buttonClicked"
    }
    else{
      ButtonPressedClass = "";
    }
    return ButtonPressedClass;
  }


  function createListSortHTML(){
    return `  
      <button id="sort-date" ${getButtonPressed("Stichtag")} data-sort-key = "Stichtag" type="button">Stichtag ${getArrow("Stichtag")}</button>
      <button id="sort-description" ${getButtonPressed("Beschreibung")} data-sort-key = "Beschreibung" type="button">Beschreibung ${getArrow("Beschreibung")}</button>
      <button id="sort-priority" ${getButtonPressed("Priorität")} data-sort-key = "Priorität" type="button">Priorität ${getArrow("Priorität")}</button>
      <button id="sort-state" ${getButtonPressed("Status")} data-sort-key = "Status" type="button">Status ${getArrow("Status")}</button>
      <button id="sort-none" data-sort-key = "none" type="button">Sortierung entfernen</button>
    `
  }

  function createListFilterHTML(){
    return `
      <button id="filter-done" ${getButtonPressed("done")} data-filter-key = "done" data-filter-word = "erledigt" type="button">Nach Erledigt filtern</button>
      <button id="filter-open" ${getButtonPressed("open")} data-filter-key = "open" data-filter-word = "offen" type="button">Nach Offen filtern</button>
    `
  }

  function renderTodos(TodosList) {
    todosDivElement.innerHTML = createTodosHTML(TodosList);
  }

  function renderListSort() {
    SortFunction.innerHTML = createListSortHTML();
  }

  function renderListFilter() {
    FilterFunction.innerHTML = createListFilterHTML();
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

  function OpenEditDialog(buttonForTodoId){
    const Todo = findTodo(buttonForTodoId, Todos);
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

  function bubbledClickEventHandler(event) {
    // takes advantage of event bubbling
    const buttonTodoId = event.target.dataset.todoId;
    const sortTodoKey = event.target.dataset.sortKey;
    const filterTodoKey = event.target.dataset.filterKey;
    if (buttonTodoId) {
      OpenEditDialog(buttonTodoId);
    }
    if(sortTodoKey){
      SortFunction.dataset.sortDirection = (SortFunction.dataset.sortFunction === sortTodoKey ? toggleValue(SortFunction.dataset.sortDirection, "up", "down") : "down");
      SortFunction.dataset.sortFunction = sortTodoKey;
      renderListSort();
      renderTodos(Todos);
    }
    if(filterTodoKey){
      FilterFunction.dataset.filterString = (FilterFunction.dataset.filterFunction === filterTodoKey ? toggleValue(FilterFunction.dataset.filterString, "none", event.target.dataset.filterWord) : event.target.dataset.filterWord);
      FilterFunction.dataset.filterFunction = filterTodoKey;
      renderListFilter();
      renderTodos(Todos);
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
      SortFunction.dataset.sortFunction = "id";
      SortFunction.dataset.sortDirection = "up";
      FilterFunction.dataset.filterFunction = "none";
    }
    else{
      const TodoIndex = findTodoIndex(overlayType.dataset.overlayId, Todos)
      Todos[TodoIndex] = input;
      localStorage.setItem('Todos',JSON.stringify(Todos));

    }
    off()
    renderTodos(Todos);
  });  

  renderListSort();
  renderListFilter();
  renderTodos(Todos);
  todosDivElement.addEventListener("click", bubbledClickEventHandler);
  SortFunction.addEventListener("click", bubbledClickEventHandler);
  FilterFunction.addEventListener("click",bubbledClickEventHandler);
}

initApp();

