import toggleValue  from '../Services/toggle-string.js';
import {todoService} from '../Services/todo-service.js';



const todosContainer = document.querySelector(".todoElements");
// eslint-disable-next-line no-undef
const todosRenderer = Handlebars.compile(document.querySelector("#todos-template").innerHTML);

const overlayContainer = document.querySelector("#form-content");
// eslint-disable-next-line no-undef
const overlayRenderer = Handlebars.compile(document.querySelector("#overlay-template").innerHTML);

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
    if(SortFunction.dataset.sortFunction === PressedString || (FilterFunction.dataset.filterString === PressedString && !(FilterFunction.dataset.filterFunction === "none"))){
      ButtonPressedClass = "class = button-clicked"
    }
    else{
      ButtonPressedClass = "";
    }
    return ButtonPressedClass;
  }


  function createListSortHTML(){
    return `  
      <button id="sort-date" ${getButtonPressed("duedate")} data-sort-key = "duedate" type="button">Stichtag ${getArrow("duedate")}</button>
      <button id="sort-description" ${getButtonPressed("description")} data-sort-key = "description" type="button">Beschreibung ${getArrow("description")}</button>
      <button id="sort-priority" ${getButtonPressed("priority")} data-sort-key = "priority" type="button">Priorität ${getArrow("priority")}</button>
      <button id="sort-state" ${getButtonPressed("state")} data-sort-key = "state" type="button">Status ${getArrow("state")}</button>
      <button id="sort-none" data-sort-key = "none" type="button">Sortierung entfernen</button>
    `
  }

  function createListFilterHTML(){
    return `
      <button id="filter-done" ${getButtonPressed("erledigt")} data-filter-key = "state" data-filter-word = "erledigt" type="button">Nach Erledigt filtern</button>
      <button id="filter-open" ${getButtonPressed("offen")} data-filter-key = "state" data-filter-word = "offen" type="button">Nach Offen filtern</button>
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
    overlayContainer.innerHTML = overlayRenderer({priority:"", duedate:""});
    on()
  });

  async function OpenEditDialog(buttonForTodoId){
      const Todo = await todoService.getTodo(buttonForTodoId);
      const overlayType = document.querySelector(".overlay-send");
      // eslint-disable-next-line no-underscore-dangle
      overlayType.dataset.overlayId = Todo._id;
      overlayContainer.innerHTML = overlayRenderer(Todo);
      const select = document.querySelector('#importance');
      const options = Array.from(select.options);
      const optionToSelect = options.find(item => item.text === String(Todo.priority));
      optionToSelect.selected = true;
      const stateBox = Todo.state==="erledigt";
      const state = document.querySelector('#state');
      state.checked = stateBox;
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
      FilterFunction.dataset.filterFunction = (FilterFunction.dataset.filterString === event.target.dataset.filterWord ? toggleValue(FilterFunction.dataset.filterFunction, "none", filterTodoKey) : filterTodoKey);
      FilterFunction.dataset.filterString = event.target.dataset.filterWord;
      renderListFilter();
      renderTodos();
    }

  }

  const form = document.getElementById("form");
  form.addEventListener("submit", async event => {
    event.preventDefault();
    const overlayType = document.querySelector(".overlay-send");
    const description = document.getElementById("description").value;
    const descriptionUpperCase = description.charAt(0).toUpperCase() + description.slice(1);
    const importance = document.getElementById("importance");
    const duedate = document.getElementById("duedate");
    const statebox = document.getElementById("state").checked;
    const state = (statebox===false ? "offen": "erledigt");
    if(parseInt(overlayType.dataset.overlayId,10) === 0){
      await todoService.createTodo(duedate.value, descriptionUpperCase, importance.value, state);
      SortFunction.dataset.sortFunction = "none";
      SortFunction.dataset.sortDirection = "up";
      FilterFunction.dataset.filterFunction = "none";
    }
    else{
      await todoService.changeTodo(overlayType.dataset.overlayId, duedate.value, descriptionUpperCase, importance.value, state);
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

