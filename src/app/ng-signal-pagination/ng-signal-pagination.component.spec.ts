import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/angular';

import { NgSignalPaginationComponent } from './ng-signal-pagination.component';

describe('NgSignalPaginationComponent', () => {
	it('determines the number of pages', async () => {
		let shows = [
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

		await render(NgSignalPaginationComponent, { inputs: { data: shows, nrOfItemsPerPage: 4 } });

		const list = screen.getByRole('list');

		expect(list.children.length).toBe(4);
	});
});
