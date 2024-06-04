// функция отправки массива в local
export async function addTodoTask({ name, owner, done }) {
  let taskList = await loadTodoItems({ owner });
  if (taskList == null) taskList = [];
  taskList.push({
    id: (taskList.length !== 0) ? calcId({ taskList }) : 0,
    name: name,
    done: done,
    owner: owner,
  });
  localStorage.setItem(owner, JSON.stringify(taskList));
};

// Функция чтения массива из local
export async function loadTodoItems(owner) {
  let taskList = await JSON.parse(localStorage.getItem(owner.owner));
  if (taskList == null) taskList = [];
  return taskList
};

// Функция вычесляющая максимальный id в списке дел
export function calcId({ taskList }) {
  let count = 0;
  let i = 0;
  for (let i in taskList) {
    if (taskList[i].id > count) {
      count = taskList[i].id;
    }
  }
  return count + 1
};

// функция изменения состояния у дела
export async function markTodoAsDone(item, owner) {
  const taskList = await loadTodoItems({ owner });
  let id = item.id;
  for (let i of taskList) {
    if (i.id == id) {
      i.done = !i.done;
      break;
    };
  };
  localStorage.setItem(owner, JSON.stringify(taskList));
};

// функция удаления из списка
export async function deleteTodoItem(item, owner) {
  const taskList = await loadTodoItems({ owner });
  for (let i in taskList) {
    if (taskList[i].id == item.id) {
      taskList.splice(i, 1);
    };
  };
  localStorage.setItem(owner, JSON.stringify(taskList));
};

// Функция для получения прошлых дел
export async function getPastTask(owner) {
  const taskList = await loadTodoItems({ owner });
  let flag = false;
  (taskList != null) ? flag = true : flag = false;
  return flag
};
