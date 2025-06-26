import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd, RouterLink } from '@angular/router';

declare let bootstrap: any; // Ensure Bootstrap is available globally

@Component({
	selector: 'app-header',
	standalone: true,
	imports: [RouterLink, CommonModule, FormsModule],
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements AfterViewInit {
	appName: string = 'To-Do App'; // Default App Name (editable)
	userName: string = ''; // Stored username (requested once)
	tempUserName: string = ''; // Temporary storage for user input
	currentRoute: string = '';
	isEditing: boolean = false;
	userNameModalInstance: any; // Modal instance

	@ViewChild('appNameElement') appNameElement!: ElementRef;

	constructor(private readonly router: Router) {
		this.loadAppName();
		this.loadUserName();

		// Listen for route changes and close navbar automatically
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.currentRoute = this.router.url;
				this.closeNavbar();
			}
		});
	}

	ngAfterViewInit() {
		// If no username is set, ask for it using modal
		if (!this.userName) {
			this.showUserNameModal();
		}
	}

	// === App Name Functions ===
	loadAppName() {
		const storedAppName = localStorage.getItem('appName');
		if (storedAppName) {
			this.appName = storedAppName;
		}
	}

	enableEditing() {
		this.isEditing = true;
	}

	saveAppName(event: any) {
		const newName = event.target.innerText.trim();
		if (newName) {
			this.appName = newName;
			localStorage.setItem('appName', newName);
		}
		this.isEditing = false;
	}

	// === User Name Functions ===
	loadUserName() {
		const storedUserName = localStorage.getItem('userName');
		if (storedUserName) {
			this.userName = storedUserName;
		}
	}

	showUserNameModal() {
		setTimeout(() => {
			const modalElement = document.getElementById('userNameModal');
			if (modalElement) {
				this.userNameModalInstance = new bootstrap.Modal(modalElement, {
					backdrop: 'static', // Prevent closing by clicking outside
					keyboard: false, // Prevent closing by pressing Escape
				});
				this.userNameModalInstance.show();
			}
		}, 500);
	}

	saveUserName() {
		if (this.tempUserName.trim()) {
			this.userName = this.tempUserName.trim();
			localStorage.setItem('userName', this.userName);

			// Close modal after saving name
			if (this.userNameModalInstance) {
				this.userNameModalInstance.hide();
			}
		} else {
			alert("Please enter your name!"); // Show alert if the field is empty
		}
	}

	closeNavbar() {
		const navbar = document.getElementById('navbarNav');
		if (navbar?.classList.contains('show')) {
			navbar.classList.remove('show'); // Close Bootstrap navbar manually
		}
	}

	@HostListener('document:click', ['$event'])
	onClickOutside(event: Event) {
		const navbarToggler = document.querySelector('.navbar-toggler');
		const navbar = document.getElementById('navbarNav');

		if (
			navbar &&
			navbarToggler &&
			!navbar.contains(event.target as Node) &&
			!navbarToggler.contains(event.target as Node)
		) {
			this.closeNavbar(); // Close navbar if clicked outside
		}
	}
}
