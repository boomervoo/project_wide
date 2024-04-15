// Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.

function createNumbersArray(count) {
  let numbersArray = [];

  for (let i = 1; i <= count; i++) {
   numbersArray.push(i, i)
  }
  return numbersArray;
}

// Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел

function shuffle(arr) {

  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr;
}

// Этап 3. Используйте две созданные функции для создания массива перемешанными номерами. На основе этого массива вы можете создать DOM-элементы карточек. У каждой карточки будет свой номер из массива произвольных чисел. Вы также можете создать для этого специальную функцию. count - количество пар.
function createCards(arr) {
  const cards = [];

  arr.forEach(element => {
   let card = document.createElement('div');
   card.classList.add('card');
   card.textContent = element;
   cards.push(card);
  });

  return cards;
}

function createFormStartGame () {
  const formWrapper = document.createElement('div')
  const form = document.createElement('form');
  const inputHorizontal = document.createElement('input');
  const inputVertical = document.createElement('input')
  const button = document.createElement('button')

  formWrapper.classList.add('form-wrapper')
  form.classList.add('form-game');
  inputHorizontal.classList.add('horizont');
  inputVertical.classList.add('vertical');
  button.classList.add('button');

  inputHorizontal.placeholder = ('Введите чётное количество карточек по горизонтали от 2 до 10');
  inputVertical.placeholder = ('Введите чётное количество карточек по вертикали от 2 до 10');
  button.textContent = 'Начать игру';

  form.append(inputHorizontal);
  form.append(inputVertical);
  form.append(button);
  formWrapper.append(form);

  return {
    form,
    inputHorizontal,
    inputVertical,
    button
  }
}

function startForm () {

  let countCard = createFormStartGame();


    document.body.appendChild(countCard.form);

  function validateInput(value) {
    return value >= 2 && value <= 10 && value % 2 === 0;
  }

  countCard.form.addEventListener('submit', (e) => {
    e.preventDefault();

    let horizontalValue = parseInt(countCard.inputHorizontal.value, 10);
    let verticalValue = parseInt(countCard.inputVertical.value, 10);

    if (!validateInput(horizontalValue) || !validateInput(verticalValue)) {
      countCard.inputHorizontal.value = "4";
      countCard.inputVertical.value = "4";
      horizontalValue = 4
      verticalValue = 4
    }
    startGame(horizontalValue, verticalValue);
  });

}

function startGame(horizontal, vertical) {

  document.body.innerHTML = '';

  const totalCards = horizontal * vertical;
  const cardsNumbers = shuffle(createNumbersArray(totalCards / 2))
  const cardsElements = createCards(cardsNumbers);

  const container = document.createElement('div')
  const gameWrapper = document.createElement('div');
  container.classList.add('container');
  gameWrapper.classList.add('card-groups');
  container.append(gameWrapper);


  let index = 0

 for (i = 0; i < horizontal; i++) {
    const row = document.createElement('div')
    row.classList.add('row-сards')

    for (j = 0; j < vertical; j++) {
      row.append(cardsElements[index++])
    }
    gameWrapper.append(row);
  }

  document.body.append(container);

  setTimeout(finishGame, 60000);

  let openCard = [];
  let foundCard = []
  gameWrapper.addEventListener('click', function (e) {
    if (e.detail == 1){
      if(e.target.classList.contains('card')) {
        e.target.style.color = 'black';
        openCard.push(e.target);
      }

      if (openCard.length === 2) {
        if (openCard[0].textContent !== openCard[1].textContent) {
          setTimeout(() => {
            openCard.forEach(card => {
              card.style.color = 'white';
            });
            openCard = [];
          }, 500);
        } else {
          openCard[0].style.background = 'lightgreen';
          openCard[1].style.background = 'lightgreen';
          foundCard.push(openCard[0], openCard[1])
          openCard = [];
        }
        if(foundCard.length == totalCards) {

          const btnClose = document.createElement('button');
          const btnWrapper = document.createElement('div')
          btnWrapper.classList.add('btn')
          btnClose.classList.add('button-close');
          btnClose.textContent = 'Начать игру заново';
          btnWrapper.append(btnClose)
          container.append(btnWrapper)

          btnClose.addEventListener('click', () => {
            document.body.innerHTML = '';
            startForm();
          })
        }
      }
    }
  });

}

function finishGame () {
  alert('Время вышло! Игра завершена.')

  const btnClose = document.createElement('button');
  const btnWrapper = document.createElement('div')
  btnWrapper.classList.add('btn')
  btnClose.classList.add('button-close');
  btnClose.textContent = 'Начать игру заново';
  btnWrapper.append(btnClose)
  container.append(btnWrapper)

  btnClose.addEventListener('click', () => {
    document.body.innerHTML = '';
    startForm();
  })

}



(() => {

 startForm();

})();
