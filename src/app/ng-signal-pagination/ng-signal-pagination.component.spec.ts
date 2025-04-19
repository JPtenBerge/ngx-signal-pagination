import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, RenderResult, screen } from '@testing-library/angular';

import { NgSignalPaginationComponent } from './ng-signal-pagination.component';
import { Show } from '../test-helpers/show';
import { getShows } from '../test-helpers/shows.data';

describe('NgSignalPaginationComponent', () => {
	it('determines the number of pages', async () => {
		await renderPagination(5);
		const list = screen.getByRole('list');
		expect(list.children.length).toBe(3);
	});

	it('offers paginated data', async () => {
		let { fixture } = await renderPagination();
		expect(fixture.componentInstance.pageData()).toEqual(getShows().slice(0, 5));
	});

	it('responds to page changes through its signal', async () => {
		let { fixture } = await renderPagination();
		fixture.componentInstance.currentPage.set(2);
		expect(fixture.componentInstance.pageData()).toEqual(getShows().slice(5, 10));
	});

	it('responds to page changes when the user clicks the page numbers ', async () => {
		let { fixture } = await renderPagination();
		let secondPageElem = screen.getByRole('list').children[1];
		fireEvent(secondPageElem, new MouseEvent('click'));
		expect(fixture.componentInstance.pageData()).toEqual(getShows().slice(5, 10));
	});

	const renderPagination = async (nrOfItemsPerPage = 5): Promise<RenderResult<NgSignalPaginationComponent<Show>>> => {
		return (await await render(NgSignalPaginationComponent, {
			inputs: { data: getShows(), config: { nrOfItemsPerPage } },
		})) as RenderResult<NgSignalPaginationComponent<Show>>;
	};
});
