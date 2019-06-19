import { Component, NgZone } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html'
})
export class AppComponent {

	constructor(private zone: NgZone) {
		(window as any).ngZone = zone;
	}
}
