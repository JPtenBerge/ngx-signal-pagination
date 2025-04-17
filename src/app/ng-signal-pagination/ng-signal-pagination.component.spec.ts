import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';

import { NgSignalPaginationComponent } from './ng-signal-pagination.component';

describe('NgSignalPaginationComponent', () => {
	let sut: NgSignalPaginationComponent<any>;
	let fixture: ComponentFixture<NgSignalPaginationComponent<any>>;
	let shows: { title: string; rating: number }[];

	beforeEach(async () => {
		shows = [
			{ title: 'Game of Thrones', rating: 9.5 },
			{ title: 'Black Mirror', rating: 9.5 },
			{ title: 'Prison Break', rating: 7 },
			{ title: 'Lost', rating: 8 },
			{ title: 'Breaking Bad', rating: 9 },
			{ title: 'Better Call Saul', rating: 9 },
			{ title: 'Friends', rating: 8 },
			{ title: 'Dexter', rating: 7.5 },
			{ title: 'The Gentlemen', rating: 9 },
			{ title: 'Ozark', rating: 8 },
			{ title: 'Alice in Borderland', rating: 7.5 },
			{ title: 'Squid Game', rating: 7.5 },
			{ title: 'Now & Again', rating: 8 },
		];
		TestBed.configureTestingModule({
			imports: [NgSignalPaginationComponent],
		});

		fixture = TestBed.createComponent(NgSignalPaginationComponent);
		fixture.componentRef.setInput('data', shows);
		sut = fixture.componentInstance;
	});

	it('determines the number of pages', () => {
		expect(4).toBe(14);
	});
});
