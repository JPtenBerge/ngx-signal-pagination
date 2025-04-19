import { describe, expect, it } from 'vitest';
import { Component, viewChild } from '@angular/core';
import { fireEvent, render, RenderResult, screen } from '@testing-library/angular';

import { NgSignalPaginationComponent } from './ng-signal-pagination.component';
import { Show } from '../test-helpers/show';
import { getShows } from '../test-helpers/shows.data';

describe('NgSignalPaginationComponent', () => {
	it('determines the number of pages', async () => {
		await renderPagination(5);
		const list = screen.getByRole('list');
		expect(list.children.length).toBe(1 + 3 + 1);
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
		let secondPageElem = screen.getByRole('list').children[2];
		fireEvent(secondPageElem, new MouseEvent('click'));
		expect(fixture.componentInstance.pageData()).toEqual(getShows().slice(5, 10));
	});

	describe('specifying a custom template', () => {
		it('renders pages', async () => {
			@Component({
				template: `
					<ng-signal-pagination [data]="shows" [config]="paging" #pagination>
						<ng-template #paginationTemplate let-pages="pages">
							<ol>
								@for (page of pages(); track page) {
									<li>{{ page }}</li>
								}
							</ol>
						</ng-template>
					</ng-signal-pagination>
				`,
				imports: [NgSignalPaginationComponent],
				standalone: true,
			})
			class FixtureComponent {}

			await render(FixtureComponent, { componentProperties: { shows: getShows(), paging: { nrOfItemsPerPage: 5 } } });
			let list = screen.getByRole('list');
			expect(list.children.length).toBe(3);
		});

		it('binds next and previous', async () => {
			@Component({
				template: `
					<ng-signal-pagination [data]="shows" [config]="paging" #pagination>
						<ng-template #paginationTemplate let-next="next" let-previous="previous">
							<button (click)="next()">next</button>
							<button (click)="previous()">prev</button>
						</ng-template>
					</ng-signal-pagination>
				`,
				imports: [NgSignalPaginationComponent],
				standalone: true,
			})
			class FixtureComponent {
				pagination = viewChild.required(NgSignalPaginationComponent);
				shows = getShows();
				paging = { nrOfItemsPerPage: 5 };
			}

			let { fixture } = await render(FixtureComponent);
			let btnNext = screen.getByRole('button', { name: 'next' });
			let btnPrevious = screen.getByRole('button', { name: 'prev' });
			btnNext.click();
			btnNext.click();
			btnPrevious.click();
			expect(fixture.componentInstance.pagination().currentPage()).toBe(2);
		});
	});

	const renderPagination = async (nrOfItemsPerPage = 5): Promise<RenderResult<NgSignalPaginationComponent<Show>>> => {
		return (await render(NgSignalPaginationComponent, {
			inputs: { data: getShows(), config: { nrOfItemsPerPage } },
		})) as RenderResult<NgSignalPaginationComponent<Show>>;
	};
});
