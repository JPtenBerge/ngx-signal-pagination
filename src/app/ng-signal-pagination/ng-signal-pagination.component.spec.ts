import { describe, expect, it, vi } from 'vitest';
import { render, RenderResult, screen } from '@testing-library/angular';

import { NgSignalPaginationComponent } from './ng-signal-pagination.component';
import { Show } from '../test-helpers/show.spec';
import { getShows } from '../test-helpers/shows.data.spec';

describe('NgSignalPaginationComponent', () => {
	it('determines the number of pages', async () => {
		await renderPagination(5);
		const list = screen.getByRole('list');
		expect(list.children.length).toBe(3);
	});

	it('offers paginated data', async () => {
		let result = await renderPagination();
		expect(result.fixture.componentInstance.pageData()).toEqual(getShows().slice(0, 5));
	});

	it('responds to page changes', async () => {
		let result = await renderPagination();
		result.fixture.componentInstance.currentPage.set(2);
		expect(result.fixture.componentInstance.pageData()).toEqual(getShows().slice(5, 10));
	});

	const renderPagination = async (nrOfItemsPerPage = 5): Promise<RenderResult<NgSignalPaginationComponent<Show>>> => {
		return (await await render(NgSignalPaginationComponent, {
			inputs: { data: getShows(), config: { nrOfItemsPerPage } },
		})) as RenderResult<NgSignalPaginationComponent<Show>>;
	};
});
