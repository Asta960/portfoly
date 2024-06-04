export class Card {
  constructor(container, cardNumber, flip) {
    this.container = container;
    this.flip = flip;
    this.card = this.createElement();
    this.cardNumber = cardNumber;
  }

  // __________________________________________createElement
  createElement() {
    const card = document.createElement('li');
    card.classList.add('card');
    this.container.append(card);

    card.addEventListener('click', () => {
      if (!this.success && !this._open) {
        this.flip(this);
      }

    });
    return card;
  }

  // ____________________________________open
  set open(value) {
    this._open = value;
    const card = this.card;

    if (this.success) {
      card.classList.add('cardSuccess')
    }
    else if (value === true) {
      card.classList.toggle('openCard');
      this.cardNumber = this._num;
    }
    else {
      card.classList.toggle('openCard');
      card.textContent = '';
    }
  }

  get open() {
    return this._open;
  }

  // _______________________________success
  set success(value) {
    this._suc = value;
  }

  get success() {
    return this._suc;
  }

  // ________________________________cardnumber
  set cardNumber(value) {
    this._num = value;
    if (this.open) {
      this.card.textContent = `${value}`;
    }
  }

  get cardNumber() {
    return this._num;
  }

}
