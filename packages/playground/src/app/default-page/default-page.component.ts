import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-default-page',
	template: `
		<ng-content></ng-content>
	`,
	styleUrls: ['./default-page.component.css']
})
export class DefaultPageComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
