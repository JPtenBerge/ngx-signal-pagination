import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Component, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { render, RenderResult, screen } from '@testing-library/angular';
import userEvent, { UserEvent } from '@testing-library/user-event';

import { NgSignalPaginationComponent } from './ng-signal-pagination.component';
import { Show } from '../test-helpers/show';
import { getShows } from '../test-helpers/shows.data';

describe('NgSignalPaginationComponent', () => {
	let user: UserEvent;

	beforeEach(() => {
		user = userEvent.setup();
	});

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
		await user.click(secondPageElem.children[0]);
		expect(fixture.componentInstance.pageData()).toEqual(getShows().slice(5, 10));
	});

	it('goes to the next page', async () => {
		let { fixture } = await renderPagination();
		let nextLi = [...screen.getByRole('list').children].at(-1)!;
		await user.click(nextLi.children[0]);
		expect(fixture.componentInstance.currentPage()).toBe(2);
	});

	it('goes to the previous page', async () => {
		let { fixture } = await renderPagination();
		fixture.componentInstance.currentPage.set(3);
		let previousLi = screen.getByRole('list').children[0];
		await user.click(previousLi.children[0]);
		expect(fixture.componentInstance.currentPage()).toBe(2);
	});

	it('goes to a specific page', async () => {
		let { fixture } = await renderPagination();

		let router = TestBed.inject(Router);
		vi.spyOn(router, 'navigate').mockImplementation(() => Promise.resolve(true));

		let pageLinks = screen.getAllByRole('link');
		await user.click(pageLinks.at(-1)!);
		expect(fixture.componentInstance.currentPage()).toBe(3);
		expect(router.navigate).toHaveBeenCalledWith(expect.any(Array), expect.objectContaining({ queryParams: { page: 3 } }));
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
			await user.click(btnNext);
			await user.click(btnNext);
			await user.click(btnPrevious);

			expect(fixture.componentInstance.pagination().currentPage()).toBe(2);
		});
	});

	const renderPagination = async (nrOfItemsPerPage = 5): Promise<RenderResult<NgSignalPaginationComponent<Show>>> => {
		return (await render(NgSignalPaginationComponent, {
			inputs: { data: getShows(), config: { nrOfItemsPerPage } },
			providers: [Router],
		})) as RenderResult<NgSignalPaginationComponent<Show>>;
	};
});
