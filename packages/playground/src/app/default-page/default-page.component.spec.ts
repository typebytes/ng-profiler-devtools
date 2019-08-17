import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultPageComponent } from './default-page.component';

describe('DefaultPageComponent', () => {
	let component: DefaultPageComponent;
	let fixture: ComponentFixture<DefaultPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DefaultPageComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DefaultPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
