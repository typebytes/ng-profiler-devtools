import { Component } from '@angular/core';
import { startTracing } from '../../../lib/src';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {
	constructor() {
		// startTracing();
	}
}
