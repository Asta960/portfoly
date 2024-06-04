import { toggleButton, getFlagLocalOrServer } from './module/toggle-button.js';

let route = '';
let toggleButtonFlag = true;
let modules = {};

// Форма создания (создаем и возвращаем)
function createTodoItemForm() {
  const form = document.createElement('form');
  const input = document.createElement('input');
  const button = document.createElement('button');
  const buttonWrapper = document.createElement('div');

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
  input.addEventListener('input', function (e) {
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
  const list = document.createElement('ul');
  list.classList.add('list-group');
  return list;
};

// Заголовок создаем и возвращаем
function creatAppTitle(title) {
  const appTitle = document.createElement('h2');
  appTitle.innerHTML = title;
  return appTitle;
};

// Создание дела и добавление его в Local или Server
export async function createTodoItem(owner, name, getPastTaskFlag = true) {
  const todoList = document.getElementsByClassName('list-group')[0];
  if (getPastTaskFlag) {
    await modules.addTodoTask({ name, owner, done: false });
  };
  let list = await modules.loadTodoItems({ owner });
  list = [...list];
  list.reverse();

  // Удаление элемонтов у ul списка
  if (todoList) {
    while (todoList.firstChild) {
      todoList.firstChild.remove();
    };
  };

  for (let i of list) {
    const item = document.createElement('li');
    const buttonGroup = document.createElement('div');
    const doneButton = document.createElement('button');
    const deleteButton = document.createElement('button');

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

    addEventButton(doneButton, deleteButton, item, owner);

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);
    todoList.append(item);
  };
};

// Функция добавления обработчиков события на кнопки
function addEventButton(doneButton, deleteButton, item, owner) {
  // Изменение состояния дела
  doneButton.addEventListener('click', function () {
    item.classList.toggle('list-group-item-success');
    modules.markTodoAsDone(item, owner);
  });

  // Удаление дела
  deleteButton.addEventListener('click', function () {
    if (confirm('Вы уверены?')) {
      item.remove();
      modules.deleteTodoItem(item, owner);
    };
  });
};

// Запуск
async function createTodoApp(container, title, owner) {
  const todoAppTitle = creatAppTitle(title);
  const todoItemForm = createTodoItemForm();
  const todoList = createTodoList();

  container.append(todoAppTitle);
  container.append(todoItemForm.form);
  container.append(todoList);

  if (toggleButtonFlag) {
    toggleButton(container, title, owner);
    toggleButtonFlag = false;
  }

  // Загружаем функции из нужного места
  (await getFlagLocalOrServer()) ? route = './module/local-app.js' :
    route = './module/server-app.js';
  const { loadTodoItems,
    addTodoTask,
    markTodoAsDone,
    deleteTodoItem,
    getPastTask
  } = await import(route);
  modules = { loadTodoItems, addTodoTask, markTodoAsDone, deleteTodoItem, getPastTask };

  // раньше были задачи?
  const getPastTaskFlag = await getPastTask(owner);
  if (getPastTaskFlag) {
    createTodoItem(owner, '666', false);
  };

  todoItemForm.form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (!todoItemForm.input.value) {
      return;
    }
    createTodoItem(owner, todoItemForm.input.value);
    todoItemForm.input.value = '';
  });
};
export { createTodoApp };
