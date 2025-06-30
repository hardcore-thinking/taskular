import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { WeatherData } from '../models/weather.model';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class WeatherService {
	private readonly apiUrl = 'https://api.weatherapi.com/v1/current.json';
	private readonly apiKey: string = environment.weatherApiKey;

	private cache: { [key: string]: { expiry: number, data: WeatherData } } = {};

	private readonly weatherSubject = new BehaviorSubject<WeatherData | null>(null);
	weather$ = this.weatherSubject.asObservable();

	constructor(private readonly http: HttpClient) {
		this.loadCachedWeather();
	}

	getWeather(city: string): Observable<WeatherData> {
		const cacheKey = city.toLowerCase();
		const now = new Date().getTime();

		// Check if the cache exists and is still valid
		if (this.cache[cacheKey] && this.cache[cacheKey].expiry > now) {
			console.log('Returning cached data for:', city);
			this.weatherSubject.next(this.cache[cacheKey].data);
			return of(this.cache[cacheKey].data);
		}

		const url = `${this.apiUrl}?key=${this.apiKey}&q=${city}&aqi=no`;

		return this.http.get<WeatherData>(url).pipe(
			tap(data => {
				// Cache the data with a 10-minute expiry time
				this.cache[cacheKey] = {
					expiry: now + 10 * 60 * 1000, // 10 minutes
					data
				};
				this.weatherSubject.next(data);
				this.saveWeatherToLocalStorage(data);
			}),
			catchError(this.handleError)
		);
	}

	private handleError(error: HttpErrorResponse) {
		let errorMessage = 'An unknown error occurred';

		if (error.error instanceof ErrorEvent) {
			errorMessage = `Client Error: ${error.error.message}`;
		} else {
			switch (error.status) {
				case 400:
					errorMessage = 'Bad Request - Invalid input';
					break;
				case 401:
					errorMessage = 'Unauthorized - Invalid API Key';
					break;
				case 403:
					errorMessage = 'Forbidden - API key does not have access';
					break;
				case 404:
					errorMessage = 'City not found';
					break;
				case 500:
					errorMessage = 'Internal Server Error - Try again later';
					break;
				default:
					errorMessage = `Server Error: ${error.status} - ${error.message}`;
			}
		}

		console.error('Weather API Error:', errorMessage);
		return throwError(() => new Error(errorMessage));
	}

	private saveWeatherToLocalStorage(data: WeatherData) {
		localStorage.setItem('weatherData', JSON.stringify(data));
	}

	private loadCachedWeather() {
		const savedWeather = localStorage.getItem('weatherData');
		if (savedWeather) {
			this.weatherSubject.next(JSON.parse(savedWeather));
		}
	}
}
