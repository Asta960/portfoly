import { Card } from './cardClass.js';

export class AmazingCard extends Card {

  set cardNumber(value) {
    super._num = value;

    const cardsImgArray = [
      '../img/img_01.jpg',
      '../img/img_02.jpg',
      '../img/img_03.jpg',
      '../img/img_04.jpg',
      '../img/img_05.jpg',
      '../img/img_06.jpg',
      '../img/img_07.jpg',
      '../img/img_08.jpg',
    ];
    const defaultImg = '../img/default.jpg';
    const card = this.card;
    const open = this.open;

    function createImgCard(src) {
      return new Promise((resolve, reject) => {
        const cardImg = document.createElement('img');
        cardImg.classList.add('cardImg');

        cardImg.src = src;

        cardImg.onload = function () {
          resolve(cardImg);
        }

        cardImg.onerror = function () {
          const error = new Error;
          error.name = 'ErrorImageSrc';
          reject(error);
        }
      })
    }

    async function appendCard() {
      if (open) {
        const cardImg = await createImgCard(cardsImgArray[value - 1])
          .catch(async (err) => {
            if (err.name === 'ErrorImageSrc') {
              return await createImgCard(defaultImg)
            } else {
              throw err
            }
          })

        card.append(cardImg);
      }
    }

    appendCard()
  }

  get cardNumber() {
    return this._num;
  }
}
