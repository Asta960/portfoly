import 'babel-polyfill';

import { createElement } from "dom-element-factory" // создание DOM елементов
import { MotherMask } from 'mother-mask'; // маска для инпутов
import { isValid, isExpirationDateValid } from "creditcard.js"; // проверка корректности даты и номера карты
import creditCardType from "credit-card-type"; // определение типа карты (visa, mir, ...)
let validator = require("email-validator"); // проверка корректности почты

import css from './style.scss';

import mirImg from './assets/img/mir_bg.jpeg';
import visaImg from './assets/img/visa_bg.jpeg';

const cardImg = {
  mir: mirImg,
  visa: visaImg
}

// Создание DOM объектов (формы) с помощью dom-element-factory
let DOM = createElement('div', { classList: 'container' },
  [
    createElement('h1', { classList: 'h1' }, 'Форма оплаты'),
    createElement('form', { 'id': 'form' },
      [
        createElement('input', { 'type': 'text', 'id': 'input_email', 'placeholder': 'email', 'required': 'required' }),
        createElement('input', { 'type': 'text', 'id': 'input_card_number', 'placeholder': 'number card', 'required': 'required' }),
        createElement('input', { 'type': 'text', 'id': 'input_card_date', 'placeholder': 'mm/yy', 'required': 'required' }),
        createElement('input', { 'type': 'text', 'id': 'input_card_code', 'placeholder': '***', 'required': 'required' }),
        createElement('p', { 'id': 'card_type' }),
        createElement('button', { 'id': 'button', 'type': 'submit', 'disabled': 'disabled' }, 'Оплатить')
      ]
    )
  ]
)

// добавление DOM объктов в дерево
document.body.append(DOM);

// добавление масок к инпутам формы
MotherMask.bind(document.getElementById('input_card_number'), '9999 9999 9999 9999');
MotherMask.bind(document.getElementById('input_card_date'), '99/99');
MotherMask.bind(document.getElementById('input_card_code'), '999');

// получение DOM формы
const form = DOM.children[1];

// обработчик события блюр, который провеояет корректность заполнения формы
form.addEventListener('blur', () => {
  const email = document.getElementById("input_email");
  const card_number = document.getElementById("input_card_number");
  const card_date = document.getElementById("input_card_date");
  const card_type = document.getElementById('card_type');
  const btn = document.getElementById('button');

  // проверка валидности почты
  if (email.value.length != 0) {
    (validator.validate(email.value) && email.value.length != 0) ?
      email.classList.remove('incorrectly') : email.classList.add('incorrectly');
  }

  // проверка валидности даты
  const date = card_date.value;
  if (date.length != 0) {
    (isExpirationDateValid(`${date[0]}${date[1]}`, `20${date[3]}${date[4]}`) && date.length != 0) ?
      card_date.classList.remove('incorrectly') : card_date.classList.add('incorrectly');
  }

  // проверка валидности номера карты
  if (card_number.value.length != 0) {
    (isValid(card_number.value)) ?
      card_number.classList.remove('incorrectly') : card_number.classList.add('incorrectly');

    // определение карты (visa, mir, ...)
    if (card_number.classList.value != 'incorrectly') {
      card_type.style.display = 'inline-block';
      const cardType = creditCardType(`${card_number.value}`)[0].type;

      if (cardType in cardImg) {
        console.log('смена фона')
        card_type.classList.add(`${cardType}`);
      } else {
        card_type.textContent = cardType;
      }
    }
  }

  // проверка условий для активации кнопки
  if (email.classList.value != 'incorrectly' && card_number.classList.value != 'incorrectly' &&
    card_date.classList.value != 'incorrectly' && form[3].value.length == 3) {
    btn.disabled = false;
  } else {
    btn.disabled = true;
  }

}, true)

// добавление обработчика всем инпутам в форме для удаления класса incorrectly на момент изменеия
for (const input of form) {
  input.addEventListener('input', () => {
    input.classList.remove('incorrectly');

    if (input.id == 'input_card_number') {
      const card_type = document.getElementById('card_type');

      for (const claccName of card_type.classList) {
        card_type.classList.remove(claccName);
      }
    }
  })
}

