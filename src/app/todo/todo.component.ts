import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-todo',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './todo.component.html',
	styleUrls: ['./todo.component.css']
})

export class TodoComponent implements OnInit {
	tasks: { text: string; completed: boolean; editing: boolean }[] = [];
	newTask: string = '';
	constructor(private readonly router: Router) { }
	ngOnInit() {
		// Load tasks from local storage
		const savedTasks = localStorage.getItem('tasks');
		if (savedTasks) {
			this.tasks = JSON.parse(savedTasks);
		}

		// Request notification permission from the user
		if ("Notification" in window) {
			Notification.requestPermission();
		}

		// Run background task every minute
		setInterval(() => {
			this.showTaskNotification();
		}, 3600000); // Every 60 mins
	}


	private showTaskNotification() {

		const userName = localStorage.getItem('userName') ?? 'User';
		const appName = localStorage.getItem('appName') ?? 'Todo App';

		if (Notification.permission === "granted") {
			let notificationMessage = '';

			if (this.remainingTasks > 0) {
				// User has pending tasks
				notificationMessage = `Hey ${userName}, you have ${this.remainingTasks} tasks to complete! ✅`;
			}

			else {
				notificationMessage = `Hey ${userName}, you have no tasks! Add new tasks in "${appName}" to stay productive. 🚀`;
			}

			const notification = new Notification("🚀 Reminder!", {
				body: notificationMessage,
				icon: "/favicon.png"
			});

			notification.onclick = () => {
				window.focus();
				this.router.navigate(['/todos']); // Navigate to the task page
			};
		}

		else if ("Notification" in window) {
			Notification.requestPermission();
		}
	}


	addTask() {
		if (this.newTask.trim()) {
			this.tasks.unshift({ text: this.newTask, completed: false, editing: false });
			this.newTask = '';
			this.saveToLocalStorage(); // Save tasks to local storage
		}
	}

	toggleTaskCompletion(index: number) {
		this.tasks[index].completed = !this.tasks[index].completed;
		this.saveToLocalStorage(); // Save tasks to local storage
	}

	toggleEditTask(index: number) {
		if (this.tasks[index].editing) {
			// Save task
			this.tasks[index].editing = false;
			this.saveToLocalStorage(); // Save tasks to local storage
		} else {
			// Enable edit mode
			this.tasks[index].editing = true;
		}
	}

	deleteTask(index: number) {
		this.tasks.splice(index, 1);
		this.saveToLocalStorage(); // Save tasks to local storage
	}

	get remainingTasks() {
		return this.tasks.filter(task => !task.completed).length;
	}

	get completedTasks() {
		return this.tasks.filter(task => task.completed).length;
	}

	private saveToLocalStorage() {
		localStorage.setItem('tasks', JSON.stringify(this.tasks));
	}
}
