import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';

@Component({
	selector: 'app-hanging-game',
	imports: [NgIf, CommonModule],
	templateUrl: './hanging-game.component.html',
	styleUrls: ['./hanging-game.component.css'],
})
export class HangingGameComponent {
	selectedWord: string = '';
	guessedLetters: string[] = [];
	incorrectGuesses: number = 0;
	maxGuesses: number = 2;
	alphabet: string[] = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
	hangmanState: string = 'neutral'; // neutral, hanging, celebrating

	constructor() {
		this.fetchRandomWord();
	}

	async fetchRandomWord(): Promise<void> {
		const fallbackWords = ['abubakkar', 'javascript', 'angular', 'typescript', 'developer'];

		try {
			const response = await fetch('https://random-word-api.vercel.app/api?words=1&length=6');
			if (!response.ok) throw new Error('API unavailable');

			const words = await response.json();
			this.selectedWord = words[0].toLowerCase(); // Use the fetched word
		} catch (error) {
			console.error('Error fetching word, using fallback:', error);
			this.selectedWord = fallbackWords[Math.floor(Math.random() * fallbackWords.length)]; // Random fallback word
		}

		console.log('Selected Word:', this.selectedWord);
		this.newGame();
	}


	newGame(): void {
		this.guessedLetters = [];
		this.incorrectGuesses = 0;
		this.hangmanState = 'neutral';

		// Add the always displayed letters to guessedLetters
		this.addDisplayedLettersToGuessed();
	}

	resetAttempt(): void {
		this.newGame();
	}

	addDisplayedLettersToGuessed(): void {
		const displayedLetters = new Set(
			this.selectedWord.split('').filter((letter, index) => {
				return (
					index === 0 ||
					index === this.selectedWord.length - 1 ||
					index === Math.floor(this.selectedWord.length / 2)
				);
			})
		);
		this.guessedLetters = Array.from(displayedLetters);
	}

	guessLetter(letter: string): void {
		letter = letter.toLowerCase(); // Ensure consistency in case
		if (!this.guessedLetters.includes(letter) && this.incorrectGuesses < this.maxGuesses) {
			this.guessedLetters.push(letter);
			const occurrences = this.selectedWord.split('').filter(l => l === letter).length;
			if (occurrences === 0) {
				this.incorrectGuesses++;
			}
		}
		this.updateHangmanState();
	}

	getRemainingLetters(): string[] {
		const displayedLetters = new Set(
			this.selectedWord.split('').filter((letter, index) => {
				return (
					index === 0 ||
					index === this.selectedWord.length - 1 ||
					index === Math.floor(this.selectedWord.length / 2)
				);
			})
		);
		const correctLetters = this.selectedWord
			.split('')
			.filter(letter => !this.guessedLetters.includes(letter) && !displayedLetters.has(letter));

		// Add a few random incorrect suggestions to confuse the user
		const allLetters = this.alphabet.map(letter => letter.toLowerCase());
		const incorrectSuggestions = allLetters
			.filter(letter => !this.selectedWord.includes(letter))
			.sort(() => Math.random() - 0.5) // Shuffle
			.slice(0, 3); // Take 3 random incorrect letters

		return [...correctLetters, ...incorrectSuggestions].sort(() => Math.random() - 0.5); // Shuffle the suggestions
	}

	getDisplayedWord(): string {
		return this.selectedWord
			.split('')
			.map((letter, index) => {
				if (
					index === 0 ||
					index === this.selectedWord.length - 1 ||
					index === Math.floor(this.selectedWord.length / 2) ||
					this.guessedLetters.includes(letter)
				) {
					return letter;
				}
				return '_';
			})
			.join(' ');
	}

	isGameWon(): boolean {
		const result = this.selectedWord.split('').every(letter => this.guessedLetters.includes(letter));

		return result;
	}

	isGameOver(): boolean {
		const result = this.incorrectGuesses >= this.maxGuesses;

		return result;
	}

	updateHangmanState(): void {
		if (this.isGameWon()) {
			this.hangmanState = 'celebrating';

		} else if (this.isGameOver()) {
			this.hangmanState = 'hanging';

		}
	}

	getGameStatus(): string {
		if (this.isGameWon()) return '🎉 Congratulations! You won! 🎉';
		if (this.isGameOver()) return `💀 Game Over! The word was: ${this.selectedWord}`;
		return '';
	}
}
