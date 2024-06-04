import { AmazingCard } from './module/AmazingCardClass.js';

const container = document.getElementById('container');
let cardSuccessList = [];
let cardNumberList = [];
let cardOpenList = [];
let cardOpenFalseList = [];


// Создание карточек
function createCard(row, column) {
  // Создание столбца с карточками. Добавление ей классов. Добавление в DOM
  let index = 0;
  for (let i = 0; i < column; i++) {
    const cardRow = document.createElement('ul');
    cardRow.classList.add('cardRow');
    container.append(cardRow);
    // Создание карточек
    for (let j = 0; j < row; j++) {
      new AmazingCard(cardRow, cardNumberList[index], function (card) {

        card.open = true;
        cardOpenList.push(card);

        if (cardOpenList.length == 2) {
          if (cardOpenList[0].cardNumber == cardOpenList[1].cardNumber) {
            cardOpenList[0].success = true;
            cardOpenList[1].success = true;
            cardSuccessList.push(cardOpenList[0]);
            cardSuccessList.push(cardOpenList[1]);

            cardOpenList = [];
          }

          cardOpenFalseList = [...cardOpenList];

        }

        if (cardOpenList.length == 3) {
          setTimeout(() => {
            for (const card of cardOpenFalseList) {
              card.open = false;
            }
          }, 100);
          cardOpenList.splice(0, 2);
        }
        if (cardSuccessList.length == cardNumberList.length) {
          winner();
        }
      });
      index++;
    }
  }
}

// Генератор массива с числами
function generatorNumberCard(row, column) {
  cardNumberList = [];
  const maxCard = (row * column) / 2;
  for (let i = 0; i < maxCard; i++) {
    cardNumberList.push(i + 1);
    cardNumberList.push(i + 1);
  }
  randomNumberCard(cardNumberList);
};

// Тасование чисел из массива
function randomNumberCard(list) {
  const count = list.length;
  for (let i = 0; i !== count; ++i) {
    const j = Math.round(Math.random() * (count - 1));
    const temp = list[i];
    list[i] = list[j];
    list[j] = temp;
  }
};

// Создание элементов начальной формы
const h2 = document.createElement('h2');
const form = document.createElement('form');
const button = document.createElement('button');
const inputRow = document.createElement('input');
const inputColumn = document.createElement('input');
const spanValueInputRow = document.createElement('span');
const spanValueInputColumn = document.createElement('span');
const divInputRow = document.createElement('div');
const divInputColumn = document.createElement('div');

// Добавление к ним классов
h2.classList.add('h2-title');
form.classList.add('form');
inputRow.classList.add('input');
inputColumn.classList.add('input');
button.classList.add('add-button');
spanValueInputRow.classList.add('span-value');
spanValueInputColumn.classList.add('span-value');
divInputRow.classList.add('div-input-row', 'div-input');
divInputColumn.classList.add('div-input-column', 'div-input');

// Добавление свойств элементам формы
inputRow.type = 'number';
inputColumn.type = 'number';
inputRow.setAttribute("type", "range");
inputColumn.setAttribute("type", "range");
inputRow.min = 2;
inputRow.max = 10;
inputColumn.min = 2;
inputColumn.max = 10;
inputRow.step = 2;
inputColumn.step = 2;
inputRow.value = 4;
inputColumn.value = 4;
inputRow.placeholder = 'Введите кол-во карточек по горизонтали';
inputColumn.placeholder = 'Введите кол-во карточек по вертикали';
h2.textContent = 'Игра "Найди пару"';
button.textContent = 'Начать';
spanValueInputRow.textContent = `Кол-во кард в ряд "${inputRow.value}"`;
spanValueInputColumn.textContent = `Кол-во кард в столбик "${inputColumn.value}"`;

// При нажатие на кнопку "Начать" инициализация игры
form.addEventListener('submit', (e) => {
  e.preventDefault();
  generatorNumberCard(inputRow.value, inputColumn.value);
  buttonDisabled(true);
  createCard(inputRow.value, inputColumn.value);
});

inputRow.addEventListener('input', () => {
  spanValueInputRow.textContent = `Кол-во кард в ряд "${inputRow.value}"`
});

inputColumn.addEventListener('input', () => {
  spanValueInputColumn.textContent = `Кол-во кард в столбик "${inputColumn.value}"`;
});

// Добавление в DOM элементов
container.append(h2);
container.append(form);
form.append(divInputRow);
form.append(divInputColumn);
divInputRow.append(spanValueInputRow);
divInputRow.append(inputRow);
divInputColumn.append(spanValueInputColumn);
divInputColumn.append(inputColumn);
form.append(button);

function buttonDisabled(flag) {
  const Button = document.getElementsByClassName('add-button');
  Button[0].disabled = flag;
};

function winner() {
  const returnButton = document.createElement('button');
  const winnerText = document.createElement('h2');
  winnerText.textContent = 'Вы выиграли!';
  returnButton.textContent = 'Сыграть ещё раз?';
  returnButton.classList.add('btn', 'return-button');
  winnerText.classList.add('winner-text')

  // обработчик нажатия на кнопку
  returnButton.addEventListener("click", () => {
    // нахождение всех удаляемых элементов
    const allCard = document.querySelectorAll('.card');
    const allDivCard = document.querySelectorAll('.cardRow');
    for (const i of allCard) {
      i.remove();
    }
    for (const i of allDivCard) {
      i.remove();
    }
    buttonDisabled(false);
    returnButton.remove();
    winnerText.remove();

    cardNumberList = [];
    cardOpenList = [];
    cardSuccessList = [];

  });


  // Добавление кнопки и текста в DOM с таймером
  setTimeout(() => {
    container.append(winnerText);
    container.append(returnButton);
  }, 500);
}
