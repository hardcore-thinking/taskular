import { Routes } from '@angular/router';
import { DragDropComponent } from './drag-drop/drag-drop.component';
import { TodoComponent } from './todo/todo.component';
import { WeatherComponent } from './components/weather/weather.component';
import { HangingGameComponent } from './hanging-game/hanging-game.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
	{ path: 'users', component: UsersComponent, pathMatch: 'full' },
	{ path: 'tasks', component: DragDropComponent, pathMatch: 'full' },
	{ path: 'todos', component: TodoComponent, pathMatch: 'full' },
	{ path: '', redirectTo: 'todos', pathMatch: 'full' },
	{ path: 'weather', component: WeatherComponent, pathMatch: 'full' },
	{ path: 'guess-word', component: HangingGameComponent, pathMatch: 'full' },
	{ path: 'weather', component: WeatherComponent, pathMatch: 'full' }
];
