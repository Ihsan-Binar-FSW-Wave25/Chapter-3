class Player {
  constructor() {
    this.batu = document.getElementsByClassName("batu");
    this.kertas = document.getElementsByClassName("kertas");
    this.gunting = document.getElementsByClassName("gunting");
  }
}

const Computer = (Base) =>
  class extends Base {
    randomPick = (max) => Math.floor(Math.random() * max);
  };

class MainPlayer extends Player {
  constructor(batu, kertas, gunting) {
    super(batu, kertas, gunting);
    this.#initiation();
  }

  #initiation() {
    this.batu[0].id = "batu-player";
    this.kertas[0].id = "kertas-player";
    this.gunting[0].id = "gunting-player";
  }
}

class ComPlayer extends Computer(Player) {
  constructor(batu, kertas, gunting) {
    super(batu, kertas, gunting);
    this.#initiation();
  }

  #initiation() {
    this.batu[1].id = "batu-com";
    this.kertas[1].id = "kertas-com";
    this.gunting[1].id = "gunting-com";
  }
}

class Rules {
  constructor() {
    this.resultText = document.createElement("H1");
    this.resultContainer = document.getElementById("versus-result");
  }

  logger = (text) => {
    console.log("----------");
    console.log(text);
  };

  _defaultState = () => {
    this.resultContainer.classList.remove("draw");
    this.resultContainer.classList.remove("versus-result");
    this.resultText.innerHTML = "VS";
    this.resultContainer.appendChild(this.resultText);
  };

  _winResult = () => {
    this.resultContainer.classList.remove("draw");
    this.resultContainer.classList.add("versus-result");
    this.resultText.innerHTML = "PLAYER WIN";
    this.resultContainer.appendChild(this.resultText);
    this.logger("Result : PLAYER Win, great ! :)");
  };

  _loseResult = () => {
    this.resultContainer.classList.remove("draw");
    this.resultContainer.classList.add("versus-result");
    this.resultText.innerHTML = "COM WIN";
    this.resultContainer.appendChild(this.resultText);
    this.logger("Result : COM Win, YOU lose :(");
  };

  _drawResult = () => {
    this.resultContainer.classList.add("versus-result");
    this.resultContainer.classList.add("draw");
    this.resultText.innerHTML = "DRAW";
    this.resultContainer.appendChild(this.resultText);
    this.logger("Result : Draw, GG !");
  };

  decision = (userChoice, botChoice) => {
    if (
      (userChoice === "batu" && botChoice === "batu") ||
      (userChoice === "kertas" && botChoice === "kertas") ||
      (userChoice === "gunting" && botChoice === "gunting")
    ) {
      return this._drawResult();
    } else if (
      (userChoice === "batu" && botChoice === "gunting") ||
      (userChoice === "kertas" && botChoice === "batu") ||
      (userChoice === "gunting" && botChoice === "kertas")
    ) {
      return this._winResult();
    } else if (
      (userChoice === "batu" && botChoice === "kertas") ||
      (userChoice === "kertas" && botChoice === "gunting") ||
      (userChoice === "gunting" && botChoice === "batu")
    ) {
      return this._loseResult();
    }
  };
}

class Game extends Rules {
  constructor(playerHand, comHand) {
    super(playerHand, comHand);
    this.resetResult = document.getElementById("reset");
    this.#initiation();
  }

  #initiation() {
    this.user = new MainPlayer();
    this.com = new ComPlayer();
    this._defaultState();
    this.resetButton();
  }

  getUserPick = (choice) => {
    this.playerHand = choice;
    this.logger(`Player choose: ${this.playerHand}`);
    return this.playerHand;
  };

  getComPick = (choice) => {
    this.comHand = choice;
    this.logger(`Com choose: ${this.comHand}`);
    return this.comHand;
  };

  setPlayerListener = () => {
    this.user.batu[0].onclick = () => {
      this.getUserPick("batu");
      this.user.batu[0].classList.add("active-hand");
      this.user.kertas[0].classList.remove("active-hand");
      this.user.gunting[0].classList.remove("active-hand");
      this.removePlayerListener();
      this.decideResult();
    };

    this.user.kertas[0].onclick = () => {
      this.getUserPick("kertas");
      this.user.batu[0].classList.remove("active-hand");
      this.user.kertas[0].classList.add("active-hand");
      this.user.gunting[0].classList.remove("active-hand");
      this.removePlayerListener();
      this.decideResult();
    };

    this.user.gunting[0].onclick = () => {
      this.getUserPick("gunting");
      this.user.batu[0].classList.remove("active-hand");
      this.user.kertas[0].classList.remove("active-hand");
      this.user.gunting[0].classList.add("active-hand");
      this.removePlayerListener();
      this.decideResult();
    };
  };

  setComListener(choice) {
    switch (choice) {
      case "batu":
        this.getComPick("batu");
        this.com.batu[1].classList.add("active-hand");
        this.com.kertas[1].classList.remove("active-hand");
        this.com.gunting[1].classList.remove("active-hand");
        break;
      case "kertas":
        this.getComPick("kertas");
        this.com.batu[1].classList.remove("active-hand");
        this.com.kertas[1].classList.add("active-hand");
        this.com.gunting[1].classList.remove("active-hand");
        break;
      case "gunting":
        this.getComPick("gunting");
        this.com.batu[1].classList.remove("active-hand");
        this.com.kertas[1].classList.remove("active-hand");
        this.com.gunting[1].classList.add("active-hand");
        break;
      default:
        break;
    }
  }

  removePlayerListener = () => {
    document.getElementsByClassName("batu")[0].disabled = true;
    document.getElementsByClassName("kertas")[0].disabled = true;
    document.getElementsByClassName("gunting")[0].disabled = true;
  };

  result = () => {
    setInterval(() => {
      if (this.playerHand && this.comHand) {
        this.decision(this.playerHand, this.comHand);
      }
      this.playerHand = null;
      this.comHand = null;
    }, 400);
  };

  decideResult() {
    switch (this.com.randomPick(3)) {
      case 2:
        this.setComListener("batu");
        break;
      case 1:
        this.setComListener("kertas");
        break;
      case 0:
        this.setComListener("gunting");
        break;
      default:
        break;
    }
    this.result();
  }

  resetButton() {
    this.resetResult.onclick = () => {
      this.logger("Game restarted !");
      this._defaultState();
      document.querySelectorAll(".hand").forEach((userButton) => {
        userButton.classList.remove("active-hand");
        userButton.disabled = false;
      });
    };
  }

  play() {
    this.logger("Lets play traditional games!");
    this.setPlayerListener();
  }
}

const game = new Game();
game.play();
