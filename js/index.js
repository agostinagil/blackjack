const d = document;

const $playerBoard = d.querySelector(".playerCards"),
  $dealerBoard = d.querySelector(".dealerCards"),
  $btn = d.getElementById("playBtn"),
  $hitBtn = d.querySelector(".hit"),
  $standBtn = d.querySelector(".stand"),
  $results = d.getElementById("results"),
  $resetBtn = d.getElementById("resetBtn");

d.addEventListener("click", (e) => {
  if (e.target === $btn) {
    createDeck();
    shuffle();
    startGame();
    $btn.classList.add("hidden");
    $resetBtn.classList.remove("hidden");
  }
  if (e.target === $hitBtn) {
    hit();
  }
  if (e.target === $standBtn) {
    stand();
  }
  if (e.target === $resetBtn) {
    console.clear();
    createDeck();
    shuffle();
    $playerBoard.textContent = "";
    $dealerBoard.textContent = "";

    $hitBtn.disabled = true;
    $standBtn.disabled = true;

    $results.textContent = "";
    dealerSum = 0;
    playerSum = 0;
    dealerAceCount = 0;
    playerAceCount = 0;
    playerFirstCards = [];
    setTimeout(() => {
      startGame();
    }, 1000);
    // console.log(dealerAceCount, dealerSum, playerAceCount, playerSum);
  }
});

let dealerSum = 0,
  playerSum = 0,
  dealerAceCount = 0,
  playerAceCount = 0,
  deck = [],
  playerFirstCards = [];

const createDeck = () => {
  const suits = ["S", "H", "D", "C"],
    values = ["2", "3", "4", "5", "6", "7", "8", "9", "J", "Q", "K", "A"];
  // deck = [];
  for (let i = 0; i < suits.length; i++) {
    for (let x = 0; x < values.length; x++) {
      deck.push(`${values[x]}-${suits[i]}`);
    }
  }
};

const shuffle = () => {
  for (let i = 0; i < deck.length; i++) {
    let location1 = Math.floor(Math.random() * deck.length);
    let location2 = deck[i];
    deck[i] = deck[location1];
    deck[location1] = location2;
  }
  // console.log(deck);
};

const dealerHiddenHand = () => {
  while (dealerSum < 17) {
    let $cards = d.createElement("img");
    let card = deck.pop();
    let cardValue = getValue(card);

    dealerSum += cardValue;
    dealerAceCount += checkAce(card);

    $cards.src = `./cards/${card}.png`;
    $cards.classList.add("card");
    $dealerBoard.append($cards);
    console.log(`dealerSum ${dealerSum}, dealerAce ${dealerAceCount}`);

    if (checkAce(card)) {
      const { sum: newDealerSum, aceCount: newDealerAceCount } = reduceAce(
        dealerSum,
        dealerAceCount
      );
      dealerSum = newDealerSum;
      dealerAceCount = newDealerAceCount;
    }
    if (dealerSum > 21 && playerSum <= 21) {
      $results.textContent = `You have ${playerSum} and Dealer has ${dealerSum}. You win!`;
    }
  }
};

const startGame = () => {
  showCard = deck.pop();
  dealerSum += getValue(showCard);
  dealerAceCount += checkAce(showCard);
  let $dealerCard = d.createElement("img");
  $dealerCard.src = `./cards/${showCard}.png`;
  $dealerCard.classList.add("card");
  $dealerBoard.append($dealerCard);

  for (let i = 0; i < 2; i++) {
    let card = deck.pop();
    playerSum += getValue(card);
    playerAceCount += checkAce(card);
    let data = card.split("-");
    let value = data[0].trim();
    playerFirstCards.push(value);
    let $playerCards = d.createElement("img");
    $playerCards.src = `./cards/${card}.png`;
    $playerCards.classList.add("card");
    $playerBoard.append($playerCards);
  }
  $results.textContent = `You have ${playerSum}. Hit or Stand?`;

  $hitBtn.disabled = false;
  $standBtn.disabled = false;
  isBlackjack(playerFirstCards);
};

const getValue = (card) => {
  let data = card.split("-");
  let value = data[0].trim();

  if (isNaN(value)) {
    return value === "A" ? 11 : 10;
  } else {
    return parseInt(value, 10);
  }
};

const checkAce = (card) => {
  if (card[0] == "A") {
    return 1;
  }
  return 0;
};

const hit = () => {
  let $playerCard = d.createElement("img");
  let card = deck.pop();
  $playerCard.src = `./cards/${card}.png`;
  $playerCard.classList.add("card");
  playerSum += getValue(card);
  playerAceCount += checkAce(card);
  $playerBoard.append($playerCard);

  const { sum, aceCount } = reduceAce(playerSum, playerAceCount);
  playerSum = sum;
  playerAceCount = aceCount;
  console.log(`playerSum ${playerSum}, playerAceCount ${playerAceCount}`);
  $results.textContent = `You have ${playerSum}. Hit or Stand?`;

  if (playerSum > 21) {
    $hitBtn.disabled = true;
    // dealerHiddenHand();
    $standBtn.disabled = true;
    $results.textContent = `You have ${playerSum}. Sorry, you lose`;
  }

  if (playerSum == 21) {
    $hitBtn.disabled = true;
    $standBtn.disabled = true;
    stand();
  }
};

const stand = () => {
  dealerHiddenHand();
  const { sum: newDealerSum, aceCount: newDealerAceCount } = reduceAce(
    dealerSum,
    dealerAceCount
  );
  const { sum: newPlayerSum, aceCount: newPlayerAceCount } = reduceAce(
    playerSum,
    playerAceCount
  );

  dealerSum = newDealerSum;
  dealerAceCount = newDealerAceCount;
  playerSum = newPlayerSum;
  playerAceCount = newPlayerAceCount;

  $results.textContent = message(newPlayerSum, newDealerSum);
  $hitBtn.disabled = true;
  $standBtn.disabled = true;
};

const reduceAce = (sum, aceCount) => {
  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount -= 1;
  }

  // console.log(`sum ${sum}, ace ${aceCount}`);
  return { sum, aceCount };
};

const isBlackjack = (playerFirstCards) => {
  if (
    playerFirstCards.includes("A") &&
    (playerFirstCards.includes("J") ||
      playerFirstCards.includes("Q") ||
      playerFirstCards.includes("K")) &&
    playerFirstCards.length === 2
  ) {
    $results.textContent = "You win! You did Blackjack!";
    $hitBtn.disabled = true;
    $standBtn.disabled = true;
    console.log("You have Blackjack");
  }
  console.log(playerFirstCards);
  return playerFirstCards;
};

const message = (playerSum, dealerSum) => {
  let message = "";
  if (playerSum > 21) {
    message = `Your points: ${playerSum} vs Dealer points: ${dealerSum}. Sorry, you lose!`;
  } else if (dealerSum > 21) {
    message = `Your points: ${playerSum} vs Dealer points: ${dealerSum}. Congrats, you win!`;
  } else if (playerSum == dealerSum) {
    message = `Your points: ${playerSum} vs Dealer points: ${dealerSum}. Ups, tie!`;
  } else if (playerSum > dealerSum) {
    message = `Your points: ${playerSum} vs Dealer points: ${dealerSum}. Congrats, you win!`;
  } else if (playerSum < dealerSum) {
    message = `Your points: ${playerSum} vs Dealer points: ${dealerSum}. Sorry, you lose`;
  }
  return message;
};
