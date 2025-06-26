import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-users',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './users.component.html',
	styleUrl: './users.component.css'
})
export class UsersComponent {
	users: { name: string; completed: boolean; editing: boolean }[] = [];
	newUser: string = '';
	constructor(private readonly router: Router) { }
	ngOnInit() {
		// Load tasks from local storage
		const savedUsers = localStorage.getItem('users');
		if (savedUsers) {
			this.users = JSON.parse(savedUsers);
		}
	}
	
	addUser() {
		if (this.newUser.trim() === '') {
			alert('User name cannot be empty!');
		}

		else if (this.users.find(user => user.name === this.newUser.trim()) !== undefined) {
			alert('User already exists!');
		}

		else {
			this.users.push({ name: this.newUser.trim(), completed: false, editing: false });
			this.newUser = '';
			this.saveToLocalStorage();
		}
	}

	toggleEditUser(index: number) {
		this.users[index].editing = !this.users[index].editing;
		if (!this.users[index].editing) {
			this.saveToLocalStorage();
		}
	}

	deleteUser(index: number) {
		this.users.splice(index, 1);
		this.saveToLocalStorage();
	}

	private saveToLocalStorage() {
		localStorage.setItem('users', JSON.stringify(this.users));
	}
}
