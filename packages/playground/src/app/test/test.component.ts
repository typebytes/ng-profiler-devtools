import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-test',
	template: `
		<div>content</div>
		{{ 2 + 2 }}
	`,
	styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
	constructor() {}

	ngOnInit() {}
}
