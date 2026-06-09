import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  round = 1;
  timeLeft = 0;
  timer: any;

  cards: any[] = [];
  selectedCards: any[] = [];
  lockBoard = false;

  emojis = [
    '🍗','🍕','🍿','🌮','🥪',
    '🥭','🍟','🍉','🍔','🍎',
    '🍇','🫑','🌶️','🍹','🍭',
    '🎂','🍪','🍡'
  ];

  ngOnInit() {
    this.startRound();
  }

  startRound() {

    this.selectedCards = [];
    this.lockBoard = false;

    let values: string[] = [];

    for (let i = 0; i < this.round; i++) {
      values.push(this.emojis[i]);
      values.push(this.emojis[i]);
    }

    this.cards = values
      .map(v => ({
        value: v,
        flipped: false,
        hidden: false
      }))
      .sort(() => Math.random() - 0.5);

    this.timeLeft = this.round * 5 + 5;

    clearInterval(this.timer);

    this.timer = setInterval(() => {

      this.timeLeft--;

      if (this.timeLeft <= 0) {

        clearInterval(this.timer);

        alert('Game Over ❌');

        this.round = 1;
        this.startRound();
      }

    }, 1000);
  }

  flipCard(card: any) {

    if (
      this.lockBoard ||
      card.flipped ||
      card.hidden
    ) {
      return;
    }

    card.flipped = true;
    this.selectedCards.push(card);

    if (this.selectedCards.length === 2) {
      this.checkMatch();
    }
  }

  checkMatch() {

    this.lockBoard = true;

    const [card1, card2] = this.selectedCards;

    if (card1.value === card2.value) {

      setTimeout(() => {

        card1.hidden = true;
        card2.hidden = true;

        this.selectedCards = [];
        this.lockBoard = false;

        this.checkRoundComplete();

      }, 1000);

    } else {

      setTimeout(() => {

        card1.flipped = false;
        card2.flipped = false;

        this.selectedCards = [];
        this.lockBoard = false;

      }, 1000);
    }
  }

  checkRoundComplete() {

    const remainingCards =
      this.cards.filter(card => !card.hidden);

    if (remainingCards.length === 0) {

      clearInterval(this.timer);

      setTimeout(() => {

        this.round++;
        this.startRound();

      }, 1000);
    }
  }
}