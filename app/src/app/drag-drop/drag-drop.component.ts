import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
	selector: 'app-drag-drop',
	imports: [CommonModule, DragDropModule, FormsModule],
	templateUrl: './drag-drop.component.html',
	styleUrl: './drag-drop.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [
		trigger('fadeInOut', [
			transition(':enter', [
				style({ opacity: 0, transform: 'scale(0.9)' }),
				animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
			]),
			transition(':leave', [
				animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' })),
			]),
		]),
		trigger('slideIn', [
			transition(':enter', [
				style({ transform: 'translateY(-20px)', opacity: 0 }),
				animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
			]),
			transition(':leave', [
				animate('300ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 })),
			]),
		]),
	],
})
export class DragDropComponent {
	newCategoryTitle = '';
	editingCategoryIndex: number | null = null;
	editingTaskIndex: number | null = null;
	editingTaskCategoryIndex: number | null = null;
	errorMessage: string = '';
	successMessage: string = '';

	categories: { title: string; tasks: string[]; taskInput?: string }[] = [];

	constructor() {
		this.loadCategoriesFromLocalStorage();
	}
	updateTask(value: string, i: number, j: number) {
		this.categories[i].tasks[j] = value;
	}
	trackTask(index: number, task: string) {
		return index; // Ensures Angular keeps track of existing tasks
	}


	addCategory() {
		this.editingCategoryIndex = null;
		if (!this.newCategoryTitle.trim()) {
			this.errorMessage = 'category';
			return;
		}
		const duplicate = this.categories.some(
			(category) => category.title.toLowerCase() === this.newCategoryTitle.trim().toLowerCase()
		);

		if (duplicate) {
			this.errorMessage = 'categoryExist';
			this.clearMessagesAfterDelay();
			return;
		}
		this.categories.push({ title: this.newCategoryTitle.trim(), tasks: [], taskInput: '' });
		this.newCategoryTitle = '';
		this.errorMessage = '';
		this.successMessage = 'Category added successfully!';
		this.saveCategoriesToLocalStorage();
		this.clearMessagesAfterDelay();
	}

	addTask(categoryIndex: number) {
		this.editingTaskIndex = null;
		const taskInput = this.categories[categoryIndex].taskInput;
		if (!taskInput?.trim()) {
			this.errorMessage = `task-${categoryIndex}`;
			return;
		}

		this.categories[categoryIndex].tasks.push(taskInput.trim());
		this.categories[categoryIndex].taskInput = '';
		this.errorMessage = '';
		this.successMessage = 'Task added successfully!';
		this.saveCategoriesToLocalStorage();
		this.clearMessagesAfterDelay();
	}

	editCategory(index: number) {
		this.editingCategoryIndex = index;
	}

	saveCategory(index: number) {
		if (!this.categories[index].title.trim()) {
			this.errorMessage = `category-edit-${index}`;
			return;
		}
		this.editingCategoryIndex = null;
		this.successMessage = 'Category updated successfully!';
		this.saveCategoriesToLocalStorage();
		this.clearMessagesAfterDelay();
	}
	moveTask(currentCategoryIndex: number, taskIndex: number, event: any) {
		const targetCategoryIndex = Number(event.target.value);
		if (targetCategoryIndex >= 0 && targetCategoryIndex !== currentCategoryIndex) {
			// Move the task
			const taskToMove = this.categories[currentCategoryIndex].tasks[taskIndex];

			// Remove from the current category
			this.categories[currentCategoryIndex].tasks.splice(taskIndex, 1);

			// Add to the target category
			this.categories[targetCategoryIndex].tasks.push(taskToMove);

			// Save updates
			this.saveCategoriesToLocalStorage();
		}
	}


	editTask(categoryIndex: number, taskIndex: number) {
		this.editingTaskIndex = taskIndex;
		this.editingTaskCategoryIndex = categoryIndex;
	}
	saveTask(categoryIndex: number, taskIndex: number) {
		if (!this.categories[categoryIndex].tasks[taskIndex].trim()) {
			this.errorMessage = `task-edit-${categoryIndex}-${taskIndex}`;
			return;
		}
		this.editingTaskIndex = null;
		this.editingTaskCategoryIndex = null;
		this.successMessage = 'Task updated successfully!';
		this.saveCategoriesToLocalStorage();
		this.clearMessagesAfterDelay();
	}

	// Delete a task
	deleteTask(categoryIndex: number, taskIndex: number) {
		this.categories[categoryIndex].tasks.splice(taskIndex, 1);
		this.successMessage = 'Task deleted successfully!';
		this.saveCategoriesToLocalStorage();
		this.clearMessagesAfterDelay();
	}

	// Delete a category
	deleteCategory(index: number) {
		this.categories.splice(index, 1);
		this.successMessage = 'Category deleted successfully!';
		this.saveCategoriesToLocalStorage();
		this.clearMessagesAfterDelay();
	}

	// Drag and drop logic for tasks
	dropTask(event: CdkDragDrop<string[]>, categoryIndex: number) {
		if (event.previousContainer === event.container) {
			moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
			transferArrayItem(
				event.previousContainer.data,
				event.container.data,
				event.previousIndex,
				event.currentIndex
			);
		}
		this.saveCategoriesToLocalStorage();
	}
	saveCategoriesToLocalStorage() {
		localStorage.setItem('categories', JSON.stringify(this.categories));
	}
	loadCategoriesFromLocalStorage() {
		try {
			const storedCategories = localStorage.getItem('categories');
			console.log("Stored Categories (Raw):", storedCategories);

			this.categories = storedCategories ? JSON.parse(storedCategories) : [];

			if (!Array.isArray(this.categories) || this.categories.length === 0) {
				this.initializeDefaultCategories();
			}
		} catch (error) {
			console.error("Error parsing categories:", error);
			this.initializeDefaultCategories();
		}
	}



	private initializeDefaultCategories() {
		this.categories = [
			{ title: 'Pending', tasks: [], taskInput: '' },
			{ title: 'In Progress', tasks: [], taskInput: '' },
			{ title: 'Completed', tasks: [], taskInput: '' },
			{ title: 'Verified', tasks: [], taskInput: '' }
		];
		this.saveCategoriesToLocalStorage();
	}
	clearMessagesAfterDelay() {
		setTimeout(() => {
			this.successMessage = '';
			this.errorMessage = '';
		}, 3000);
	}
	getConnectedLists(): string[] {
		return this.categories.map((_, index) => `category-${index}`);
	}
}
