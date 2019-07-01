import { Component, NgZone } from '@angular/core';
import { start } from './angular-diagnostic';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {

	constructor() {
		start();
	}
}
