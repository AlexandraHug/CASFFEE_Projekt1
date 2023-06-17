import toggleValue  from '../Services/toggle-string.js';
import {todoService} from '../Services/todo-service.js';



const todosContainer = document.querySelector(".todoElements");
// eslint-disable-next-line no-undef
const todosRenderer = Handlebars.compile(document.querySelector("#todos-template").innerHTML);

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
  const FilterFunction = document.querySelector(".listFilter");
  const SortFunction = document.querySelector(".listSort");

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
    if(SortFunction.dataset.sortFunction === PressedString || (FilterFunction.dataset.filterString === PressedString && !(FilterFunction.dataset.filterString === "none"))){
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
      <button id="filter-done" ${getButtonPressed("erledigt")} data-filter-key = "Status" data-filter-word = "erledigt" type="button">Nach Erledigt filtern</button>
      <button id="filter-open" ${getButtonPressed("offen")} data-filter-key = "Status" data-filter-word = "offen" type="button">Nach Offen filtern</button>
    `
  }

  async function renderTodos() {
    const SortFunctionForHtml = document.querySelector(".listSort");
    const sortKey = SortFunctionForHtml.dataset.sortFunction;
    const {sortDirection} = SortFunctionForHtml.dataset;
    const FilterFunctionForHtml = document.querySelector(".listFilter");
    const filterKey =  FilterFunctionForHtml.dataset.filterFunction;
    const filterBy = FilterFunctionForHtml.dataset.filterString;
    const todoElements = {todos: await todoService.getTodos(sortKey, sortDirection, filterKey, filterBy)};
    todosContainer.innerHTML = todosRenderer(todoElements);
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

  async function OpenEditDialog(buttonForTodoId){
      const Todo = await todoService.getTodo(buttonForTodoId);
      const overlayType = document.querySelector(".overlay-send");
      // eslint-disable-next-line no-underscore-dangle
      overlayType.dataset.overlayId = Todo._id;
      const FormContent = document.getElementById("form-content");
      const content = `
      <label for="description">Beschreibung</label>
      <textarea id="description" name="description" required>${String(Todo.Beschreibung)}</textarea>

      <br />

      <label for="importance">Priorität</label>
      <select name="importance" id="importance" value=${Todo.Priorität} required>
        <option value="">Bitte wählen sie eine Priorität aus</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </select>

      <br />

      <label for="duedate">Stichtag</label>
      <input id="duedate" type="date" name="duedate" value = ${String(Todo.Stichtag)} required/>

      <br />

      <div id="state-checkbox">
        <input id="state" type="checkbox" name="state" value="done">
        <label for="state">Erledigt</label>
      </div> 
      `;
      FormContent.innerHTML = content;
      const select = document.querySelector('#importance');
      const options = Array.from(select.options);
      const optionToSelect = options.find(item => item.text === String(Todo.Priorität));
      optionToSelect.selected = true;
      const status = Todo.Status==="erledigt";
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
      renderTodos();
    }
    if(filterTodoKey){
      FilterFunction.dataset.filterString = (FilterFunction.dataset.filterFunction === filterTodoKey ? toggleValue(FilterFunction.dataset.filterString, "none", event.target.dataset.filterWord) : event.target.dataset.filterWord);
      FilterFunction.dataset.filterFunction = filterTodoKey;
      renderListFilter();
      renderTodos();
    }

  }

  const form = document.getElementById("form");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const overlayType = document.querySelector(".overlay-send");
    const description = document.getElementById("description");
    const importance = document.getElementById("importance");
    const duedate = document.getElementById("duedate");
    const state = document.getElementById("state").checked;
    const status = (state===false ? "offen": "erledigt");
    if(parseInt(overlayType.dataset.overlayId,10) === 0){
      await todoService.createTodo(duedate.value, description.value, importance.value, status);
      SortFunction.dataset.sortFunction = "none";
      SortFunction.dataset.sortDirection = "up";
      FilterFunction.dataset.filterFunction = "none";
    }
    else{
      await todoService.changeTodo(overlayType.dataset.overlayId, duedate.value, description.value, importance.value, status);
    }
    off()
    renderTodos();
  });  

  renderListSort();
  renderListFilter();
  renderTodos();
  todosContainer.addEventListener("click", bubbledClickEventHandler);
  SortFunction.addEventListener("click", bubbledClickEventHandler);
  FilterFunction.addEventListener("click",bubbledClickEventHandler);
}

initApp();

