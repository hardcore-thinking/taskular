import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { WeatherService } from './../../service/weather.service';
import { WeatherData } from '../../models/weather.model';

@Component({
	selector: 'app-weather',
	standalone: true,
	imports: [FormsModule, CommonModule],
	templateUrl: './weather.component.html',
	styleUrls: ['./weather.component.css'],
	animations: [
		trigger('fadeIn', [
			state('void', style({ opacity: 0, transform: 'scale(0.95)' })),
			transition(':enter', [
				animate('500ms ease-in-out', style({ opacity: 1, transform: 'scale(1)' }))
			])
		]),
		trigger('bounce', [
			transition(':enter', [
				style({ transform: 'translateY(-20px)', opacity: 0 }),
				animate('600ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
			])
		])
	]
})
export class WeatherComponent implements OnInit {
	weatherData!: WeatherData | null;
	city: string = '';
	errorMessage: string = '';
	isLoading = false;
	private readonly weatherService = inject(WeatherService);

	ngOnInit(): void {
		this.errorMessage = '';
		this.weatherService.weather$.subscribe(data => {
			if (data) {
				this.weatherData = data;
			}
		});
		this.isLoading = false;
	}

	fetchWeather() {
		this.errorMessage = '';
		this.isLoading = true;
		if (this.city.trim() !== '') {
			this.isLoading = true;
			this.weatherService.getWeather(this.city).subscribe({
				next: (data) => {
					this.weatherData = data;
					this.isLoading = false;
				},
				error: (err) => {
					console.error('Component Error:', err);
					this.errorMessage = 'City not found. Try again!';
					this.weatherData = null;
					this.isLoading = false;
				}
			});
		}

		else {
			this.errorMessage = 'Please enter city';
			this.isLoading = false;
			this.weatherData = null;
		}
	}
}
