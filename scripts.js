import { petNames, petEmojis, petEpitaphs } from "./library/pet_properties.js";

// returns a random number in the interval [min, max]
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// returns a random name from petNames array
function pickName() {
  return petNames[randomNumber(0, petNames.length - 1)];
}

// returns a random emoji from petEmojis array
function pickEmoji() {
  return petEmojis[randomNumber(0, petEmojis.length - 1)];
}

// returns a random epitaph from petEpitaphs array
function pickEpitaph() {
  return petEpitaphs[randomNumber(0, petEpitaphs.length - 1)];
}

// creates pet object and pushes it to petList array, then renders the pet card
function addPet() {
  const pet = {
    name: pickName(),
    emoji: pickEmoji(),
    epitaph: pickEpitaph(),
    hunger: 0,
    love: 100,
    isAlive: true,
  };
  petList.push(pet);
  renderCard(pet);
}

// starts game and sets the gameInterval
function startGame() {
  let valueAdjustments = setInterval(function () {
    render();
    for (let pet of petList) {
      if (pet.isAlive) {
        if (pet.hunger < 100) {
          pet.hunger += 5;
        }
        if (pet.love > 0) {
          pet.love -= 5;
        }
        if (pet.hunger === 100 || pet.love === 0) {
          pet.isAlive = false;
        }
      }
    }

    // stop adjusting pet values if all pets are dead (game ends/loss condition)
    if (checkIfAllDead()) {
      render();
      clearInterval(valueAdjustments);
    }
  }, 1000);
  // generate pets only if all pets are alive
  let generatePetInterval = setInterval(function () {
    if (checkAliveStatus()) {
      addPet();
    } else {
      clearInterval(generatePetInterval);
    }
  }, 30000);
}

// display property values for the pets in petList
function render() {
  let hungerMeter, loveMeter, card, meterFeedContainer, emoji, epitaph;
  for (let pet of petList) {
    let index = petList.indexOf(pet);
    card = document.querySelector(`#card${index}`);
    hungerMeter = document.querySelector(`#hunger${index}`);
    loveMeter = document.querySelector(`#love${index}`);
    hungerMeter.value = petList[index].hunger;
    loveMeter.value = petList[index].love;
    if (!pet.isAlive) {
      meterFeedContainer = document.querySelector(`#meterfeed${index}`);
      emoji = document.querySelector(`#emoji${index}`);
      epitaph = document.querySelector(`#epitaph${index}`);
      emoji.style.backgroundColor = "black";
      emoji.style.borderRadius = "10px";
      card.classList.add("dead");
      meterFeedContainer.setAttribute("class", "hidden");
      epitaph.classList.remove("hidden");
    }
  }
}

// creates and displays a pet card
function renderCard(pet) {
  const index = petList.indexOf(pet);
  const fragment = document.createDocumentFragment();
  const cardContainer = document.createElement("div"); // card container
  cardContainer.classList.add("cards");
  cardContainer.setAttribute("id", `card${petList.length - 1}`);
  fragment.append(cardContainer);
  const cardEmoji = document.createElement("p"); // emoji
  cardEmoji.setAttribute("id", `emoji${index}`);
  cardEmoji.classList.add("card-emojis");
  cardEmoji.textContent = pet.emoji;
  cardEmoji.addEventListener("click", function () {
    pet.love = 100;
  });
  cardContainer.append(cardEmoji);
  const cardName = document.createElement("h2"); // name
  cardName.textContent = pet.name;
  cardName.classList.add("card-names");
  cardContainer.append(cardName);
  const meterFeedContainer = document.createElement("div"); // meters and feed button container (to hide)
  meterFeedContainer.classList.add("meter-feed-container");
  meterFeedContainer.setAttribute("id", `meterfeed${petList.length - 1}`);
  cardContainer.append(meterFeedContainer);
  const cardHungerTitle = document.createElement("p"); // hunger title
  cardHungerTitle.classList.add("card-hunger-titles");
  cardHungerTitle.textContent = "Hunger:";
  meterFeedContainer.append(cardHungerTitle);
  const cardHungerMeter = document.createElement("meter"); // hunger meter
  cardHungerMeter.classList.add("card-hunger-meters");
  cardHungerMeter.setAttribute("id", `hunger${petList.length - 1}`);
  cardHungerMeter.setAttribute("min", 0);
  cardHungerMeter.setAttribute("max", 100);
  cardHungerMeter.setAttribute("value", pet.hunger);
  meterFeedContainer.append(cardHungerMeter);
  const cardLoveTitle = document.createElement("p"); // love title
  cardLoveTitle.classList.add("card-love-titles");
  cardLoveTitle.textContent = "Love:";
  meterFeedContainer.append(cardLoveTitle);
  const cardLoveMeter = document.createElement("meter"); // love meter
  cardLoveMeter.classList.add("card-love-meters");
  cardLoveMeter.setAttribute("id", `love${petList.length - 1}`);
  cardLoveMeter.setAttribute("min", 0);
  cardLoveMeter.setAttribute("max", 100);
  cardLoveMeter.setAttribute("value", pet.love);
  meterFeedContainer.append(cardLoveMeter);
  const feedButton = document.createElement("button"); // feed button
  feedButton.setAttribute("type", "button");
  feedButton.setAttribute("id", `feed${petList.length - 1}`);
  feedButton.classList.add("feed-buttons");
  feedButton.textContent = "Feed me 🍞";
  feedButton.addEventListener("click", function () {
    pet.hunger = 0;
  });
  meterFeedContainer.append(feedButton);
  const cardEpitaph = document.createElement("p"); // epitaph (hidden)
  cardEpitaph.classList.add("hidden");
  cardEpitaph.classList.add("card-epitaphs");
  cardEpitaph.setAttribute("id", `epitaph${petList.length - 1}`);
  cardEpitaph.textContent = `"${pet.epitaph}"`;
  cardContainer.append(cardEpitaph);
  const gameContainer = document.querySelector("#game-display-container");
  gameContainer.append(fragment); // append fragment to game display
}

// returns true if all pets are alive, false otherwise
function checkAliveStatus() {
  let areAllAlive = true;
  for (let pet of petList) {
    if (!pet.isAlive) {
      areAllAlive = false;
    }
  }
  return areAllAlive;
}

// returns true if all pets are dead, false otherwise
function checkIfAllDead() {
  let areAllDead = true;
  for (let pet of petList) {
    if (pet.isAlive) {
      areAllDead = false;
      break;
    }
  }
  return areAllDead;
}

// create array to hold all the pet objects
const petList = [];

// add an initial pet
addPet();

// start the game
startGame();
