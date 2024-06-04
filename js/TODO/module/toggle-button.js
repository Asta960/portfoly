import { createTodoApp } from '../todo-app.js';

// Функция прямой отправки в Local
async function sendArrayData(name, owner) {
  localStorage.setItem(owner, JSON.stringify(name));
}

// фунция полученияя из локала
async function readArrayData() {
  return await JSON.parse(localStorage.getItem(ownerButton));
};

let flagLocalOrServer = true;
const ownerButton = 'button';

if (!(ownerButton in localStorage)) {
  sendArrayData(true, ownerButton);
  flagLocalOrServer = readArrayData();
}

flagLocalOrServer = await readArrayData();

export function toggleButton(container, title, owner) {
  const toggleButton = document.getElementsByClassName('button-toggle')[0];
  toggleButton.addEventListener('click', async function () {
    flagLocalOrServer = await readArrayData();
    flagLocalOrServer = !flagLocalOrServer;
    sendArrayData(flagLocalOrServer, ownerButton);

    (flagLocalOrServer) ? toggleButton.textContent = 'Переключиться на Сервер' :
      toggleButton.textContent = 'Переключиться на Local storage';
    while (container.firstChild) {
      container.firstChild.remove();
    };
    createTodoApp(container, title, owner);
  });

  (flagLocalOrServer) ? toggleButton.textContent = 'Переключиться на Сервер' :
    toggleButton.textContent = 'Переключиться на Local storage';
};


export async function getFlagLocalOrServer() {
  let flagLocalOrServer = await readArrayData();
  return flagLocalOrServer;
};

