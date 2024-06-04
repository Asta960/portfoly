import {
  loadTodoItems as loadTodoItemsServer,
  createTodoItem as createTodoItemServer,
  markTodoAsDone as markTodoAsDoneServer,
  deleteTodoItem as deleteTodoItemServer
} from './module/server-app.js';
import { calcId } from './module/on-local.js';
import {sendArrayData, readArrayData} from './module/local-app.js';
import {toggleButton, getFlagLocalOrServer} from './module/toggle-button.js';

let route = '';
let modules = '';
let taskArray = [];
let i = 0;
let toggleButtonFlag = true;

// Форма создания (создаем и возвращаем)
function createTodoItemForm() {
  let form = document.createElement('form');
  let input = document.createElement('input');
  let button = document.createElement('button');
  let buttonWrapper = document.createElement('div');

  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  button.classList.add('btn', 'btn-primary');
  buttonWrapper.classList.add('input-group-append');
  input.placeholder = 'Введите название нового дела';
  button.textContent = 'Добавить дело';

  buttonWrapper.append(button);
  form.append(input);
  form.append(buttonWrapper);

  button.disabled = true;
  input.addEventListener('input', function(e) {
      e.preventDefault();
      if (input.value.length > 0) {
          button.disabled = false;
      } else if (input.value.length == 0) {
          button.disabled = true;
      }
  });

  return { form, input, button };
};

// Список элементов (создаем и возвращаем)
function createTodoList() {
  let list = document.createElement('ul');
  list.classList.add('list-group');
  return list;
};

// Заголовок (создаем и возвращаем
function creatAppTitle(title) {
  let appTitle = document.createElement('h2');
  appTitle.innerHTML = title;
  return appTitle;
};

async function load(owner, todoList) {
  (getFlagLocalOrServer()) ? route = './module/on-local.js':
  route = './module/on-server.js';
  modules = await import(route);
  taskArray = await modules.checkArray(owner, todoList);
  console.log(taskArray)
}

// Добавление в TaskArray
export async function addTask(name, owner, done, todoList) {

  // Добавление в Локал или на Сервер + добавление в taskArray
  if (getFlagLocalOrServer()) {
    taskArray.push({
      id: (taskArray.length !== 0) ? calcId({ taskArray }) : 0,
      name: name,
      done: done,
      owner: owner,
    });
    sendArrayData(taskArray, owner);
  } else {
    await createTodoItemServer({ name: name, owner: owner, done });
    const reports = await loadTodoItemsServer({ owner: owner });
    taskArray.push({
      id: reports[reports.length - 1].id,
      name: reports[reports.length - 1].name,
      done: reports[reports.length - 1].done,
      owner: owner,
    });
  };

  createTodoItem(taskArray, todoList, owner);
};

// Создание дела
export function createTodoItem(list, todoList, owner) {

  // Удаление элемонтов у ul списка
  while (todoList.firstChild) {
    todoList.firstChild.remove();
  };

  for (i of list) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = i.name;
    item.id = `${i.id}`;
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success')
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger')
    deleteButton.textContent = 'Удалить';

    // Изменение состояния дела на true
    if (i.done) {
      item.classList.toggle('list-group-item-success');
    };

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    addEventButton(doneButton, deleteButton, item, owner);
    todoList.append(item);
  };
};

// функция изменения состояния у дела
function changeDone(id) {
  for (i of taskArray) {
    if (i.id == id) {
      i.done = !i.done;
      return;
    };
  };
};

// функция удаления из списка
function changeDelete(id) {
  for (i in taskArray) {
    if (taskArray[i].id == id) {
      taskArray.splice(i, 1);
    };
  };
};

// Функция добавления обработчиков события на кнопки
function addEventButton(doneButton, deleteButton, item, owner) {
  // Изменение состояния дела и запись изменения
  doneButton.addEventListener('click', function () {
    item.classList.toggle('list-group-item-success');
    changeDone(item.id);
    if (getFlagLocalOrServer()) {
      sendArrayData(taskArray, owner);
    } else {
      for (i of taskArray) {
        if (i.id == item.id) {
          markTodoAsDoneServer(item, (i.done));
        };
      };
    };
  });

  // Удаление дела
  deleteButton.addEventListener('click', function () {
    if (confirm('Вы уверены?')) {
      item.remove();
      changeDelete(item.id);
      if (getFlagLocalOrServer()) {
        sendArrayData(taskArray, owner);
      } else {
        deleteTodoItemServer(item);
      };
    };
  });
};

// Запуск
function createTodoApp(container, title = 'Список дел', owner) {
  let todoAppTitle = creatAppTitle(title);
  let todoItemForm = createTodoItemForm();
  let todoList = createTodoList();
  taskArray = [];

  load(owner, todoList);

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  if (toggleButtonFlag) {
    toggleButton(container, title, owner);
    toggleButtonFlag = false;
  }

  todoItemForm.form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!todoItemForm.input.value) {
      return;
    }

    const todoItem = addTask(todoItemForm.input.value, owner, false, todoList);
    todoItemForm.input.value = '';
  });
};
export { createTodoApp };
