// document.addEventListener('DOMContentLoaded', () => {

  var cardArray = [];
  var background = "";


  const resultDisplay = document.querySelector('#result')
  var moves = 0;
  let cardsChosen = []
  let cardsChosenId = []
  let cardsWon = []
  var grid;

  //create your board
  function createBoard(url) {

    grid = document.createElement('div')
    grid.classList.add('grid')


    var txt = document.getElementById('text_box');


    txt.appendChild(grid);

      $.getScript("/player/scripts/scriptGeneral.js").done(function() {
          getJson(url).then(function(json) {

            for(i = 1; i < json.memory.length; i++){
              for(j = 0; j < 2; j++){
                cardArray.push({name : json.memory[i].name, img: json.memory[i].value});
              }
            }

            cardArray.sort(() => 0.5 - Math.random())

            background = json.memory[0].value;

            for (let i = 0; i < cardArray.length; i++) {
              const card = document.createElement('img')
              card.setAttribute('src', background) //src unkwown, boh
              card.setAttribute('data-id', i)
              card.addEventListener('click', flipCard)
              card.classList.add('bordered');

              grid.appendChild(card)
            }


          });
      });
  }

  //check for matches
  function checkForMatch() {
    moves++;
    //resultDisplay.textContent = moves;
    const cards = document.querySelectorAll('img')
    const optionOneId = cardsChosenId[0]
    const optionTwoId = cardsChosenId[1]

    if(optionOneId == optionTwoId) {
      cards[optionOneId].setAttribute('src', background)
      cards[optionTwoId].setAttribute('src', background)
    }
    else if (cardsChosen[0] === cardsChosen[1]) {
      cards[optionOneId].removeEventListener('click', flipCard)
      cards[optionTwoId].removeEventListener('click', flipCard)
      cardsWon.push(cardsChosen)
    } else {
      cards[optionOneId].setAttribute('src', background)
      cards[optionTwoId].setAttribute('src', background)
    }
    cardsChosen = []
    cardsChosenId = []
    if  (cardsWon.length === cardArray.length/2) {
      //resultDisplay.textContent = 'Congratulations! You found them all!'
      while(grid.fistChild) {
        grid.removeChild(parent.firstChild);
      }

      grid.remove();
      next(); //se così non funziona allora devo fare un metodo che guardi il flag che pacco
    }
  }

  //flip your card
  function flipCard() {
    if(cardsChosen.length < 2){      
      let cardId = this.getAttribute('data-id')
      cardsChosen.push(cardArray[cardId].name)
      cardsChosenId.push(cardId)
      this.setAttribute('src', cardArray[cardId].img)
    }
    if (cardsChosen.length ===2) {
      setTimeout(checkForMatch, 500)
    }
  }

  //createBoard()
//})
