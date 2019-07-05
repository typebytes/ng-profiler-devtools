import { Component } from '@angular/core';
import { start } from './lib';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {
	constructor() {
		start();
	}
}
