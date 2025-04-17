import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgSignalPaginationComponent } from './ng-signal-pagination.component';

describe('NgSignalPaginationComponent', () => {
	let component: NgSignalPaginationComponent;
	let fixture: ComponentFixture<NgSignalPaginationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NgSignalPaginationComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(NgSignalPaginationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
