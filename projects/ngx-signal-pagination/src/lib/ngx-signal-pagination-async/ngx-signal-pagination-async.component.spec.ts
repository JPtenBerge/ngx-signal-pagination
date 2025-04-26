// import { Component, signal, viewChild } from '@angular/core';
// import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
// import { fireEvent, render, RenderResult, screen } from '@testing-library/angular';
// import userEvent, { UserEvent } from '@testing-library/user-event';

// import { NgxSignalPaginationAsyncComponent } from './ngx-signal-pagination-async.component';
// import { Show } from '../test-helpers/show';
// import { getShows } from '../test-helpers/shows.data';
// import { SimpleQueryStringService } from '../services/simple-query-string.service';
// import { CreateQueryResult, injectQuery } from '@tanstack/angular-query-experimental';
// import { AsyncData } from '../types/async-data';

// describe('Component: NgSignalPaginationAsync', () => {
// 	let user: UserEvent;
// 	let simpleQueryStringServiceMock: {
// 		setPageInQueryString: Mock<() => void>;
// 		getPageFromQueryString: Mock<() => number | null>;
// 	};
// 	let resolve: AsyncData<Show>;

// 	beforeEach(() => {
// 		user = userEvent.setup();
// 		resolve = {
// 			pagedData: getShows(),
// 			nrOfPages: 4,
// 			currentPage: 2,
// 		};
// 		simpleQueryStringServiceMock = { setPageInQueryString: vi.fn(), getPageFromQueryString: vi.fn().mockReturnValue(null) };
// 	});

// 	it('determines the number of pages', async () => {
// 		await renderPagination(5);
// 		const list = screen.getByRole('list');
// 		expect(list.children.length).toBe(1 + resolve.nrOfPages + 1);
// 	});

// 	// it('offers paginated data', async () => {
// 	// 	let { fixture } = await renderPagination();
// 	// 	expect(fixture.componentInstance.pageData()).toEqual(getShows().slice(0, 5));
// 	// });

// 	// it('responds to page changes through its signal', async () => {
// 	// 	let { fixture } = await renderPagination();
// 	// 	fixture.componentInstance.currentPage.set(2);
// 	// 	expect(fixture.componentInstance.pageData()).toEqual(getShows().slice(5, 10));
// 	// });

// 	// it('responds to page changes when the user clicks the page numbers ', async () => {
// 	// 	let { fixture } = await renderPagination();
// 	// 	let secondPageElem = screen.getByRole('list').children[2];
// 	// 	await user.click(secondPageElem.children[0]);
// 	// 	expect(fixture.componentInstance.pageData()).toEqual(getShows().slice(5, 10));
// 	// });

// 	// it('goes to the next page', async () => {
// 	// 	// Arrange
// 	// 	let { fixture } = await renderPagination();

// 	// 	// Act
// 	// 	let nextLi = [...screen.getByRole('list').children].at(-1)!;
// 	// 	await user.click(nextLi.children[0]);

// 	// 	// Assert
// 	// 	expect(fixture.componentInstance.currentPage()).toBe(2);
// 	// 	expect(simpleQueryStringServiceMock.setPageInQueryString).toHaveBeenCalledWith(2);
// 	// });

// 	// it('goes to the previous page', async () => {
// 	// 	// Arrange
// 	// 	let { fixture } = await renderPagination();

// 	// 	// Act
// 	// 	fixture.componentInstance.currentPage.set(3);
// 	// 	let previousLi = screen.getByRole('list').children[0];
// 	// 	await user.click(previousLi.children[0]);

// 	// 	// Assert
// 	// 	expect(fixture.componentInstance.currentPage()).toBe(2);
// 	// 	expect(simpleQueryStringServiceMock.setPageInQueryString).toHaveBeenCalledWith(2);
// 	// });

// 	// it('goes to a specific page', async () => {
// 	// 	// Arrange
// 	// 	let { fixture } = await renderPagination();

// 	// 	// Act
// 	// 	let pageLinks = screen.getAllByRole('link');
// 	// 	await user.click(pageLinks.at(-1)!);

// 	// 	// Assert
// 	// 	expect(fixture.componentInstance.currentPage()).toBe(3);
// 	// 	expect(simpleQueryStringServiceMock.setPageInQueryString).toHaveBeenCalledWith(3);
// 	// });

// 	// it('responds to URL changes through the history API', async () => {
// 	// 	let { fixture } = await renderPagination();
// 	// 	simpleQueryStringServiceMock.getPageFromQueryString.mockReturnValue(42);
// 	// 	fireEvent(window, new PopStateEvent('popstate'));
// 	// 	expect(fixture.componentInstance.currentPage()).toBe(42);
// 	// });

// 	// it('ignores URL changes with no page information', async () => {
// 	// 	// Arrange
// 	// 	let { fixture } = await renderPagination();
// 	// 	fixture.componentInstance.currentPage.set(42);
// 	// 	simpleQueryStringServiceMock.getPageFromQueryString.mockReturnValue(null);

// 	// 	// Act
// 	// 	fireEvent(window, new PopStateEvent('popstate'));

// 	// 	// Assert
// 	// 	expect(fixture.componentInstance.currentPage()).toBe(42);
// 	// });

// 	// it('ignores URL changes if the current page is already set to the value in the URL', async () => {
// 	// 	// Arrange
// 	// 	let { fixture } = await renderPagination();
// 	// 	fixture.componentInstance.currentPage.set(42);
// 	// 	simpleQueryStringServiceMock.getPageFromQueryString.mockReturnValue(42);
// 	// 	vi.spyOn(fixture.componentInstance.currentPage, 'set').mockImplementation(() => {});

// 	// 	// Act
// 	// 	fireEvent(window, new PopStateEvent('popstate'));

// 	// 	// Assert
// 	// 	expect(fixture.componentInstance.currentPage()).toBe(42);
// 	// 	expect(fixture.componentInstance.currentPage.set).not.toHaveBeenCalled();
// 	// });

// 	// describe('specifying a custom template', () => {
// 	// 	it('renders pages', async () => {
// 	// 		@Component({
// 	// 			template: `
// 	// 				<ngx-signal-pagination [data]="shows" [config]="paging" #pagination>
// 	// 					<ng-template #paginationTemplate let-pages="pages">
// 	// 						<ol>
// 	// 							@for (page of pages(); track page) {
// 	// 								<li>{{ page }}</li>
// 	// 							}
// 	// 						</ol>
// 	// 					</ng-template>
// 	// 				</ngx-signal-pagination>
// 	// 			`,
// 	// 			imports: [NgSignalPaginationComponent],
// 	// 			standalone: true,
// 	// 		})
// 	// 		class FixtureComponent {}

// 	// 		await render(FixtureComponent, { componentProperties: { shows: getShows(), paging: { nrOfItemsPerPage: 5 } } });
// 	// 		let list = screen.getByRole('list');
// 	// 		expect(list.children.length).toBe(3);
// 	// 	});

// 	// 	it('binds next and previous', async () => {
// 	// 		@Component({
// 	// 			template: `
// 	// 				<ngx-signal-pagination [data]="shows" [config]="paging" #pagination>
// 	// 					<ng-template #paginationTemplate let-next="next" let-previous="previous">
// 	// 						<button (click)="next()">next</button>
// 	// 						<button (click)="previous()">prev</button>
// 	// 					</ng-template>
// 	// 				</ngx-signal-pagination>
// 	// 			`,
// 	// 			imports: [NgSignalPaginationComponent],
// 	// 			standalone: true,
// 	// 		})
// 	// 		class FixtureComponent {
// 	// 			pagination = viewChild.required(NgSignalPaginationComponent);
// 	// 			shows = getShows();
// 	// 			paging = { nrOfItemsPerPage: 5 };
// 	// 		}

// 	// 		let { fixture } = await render(FixtureComponent);
// 	// 		let btnNext = screen.getByRole('button', { name: 'next' });
// 	// 		let btnPrevious = screen.getByRole('button', { name: 'prev' });
// 	// 		await user.click(btnNext);
// 	// 		await user.click(btnNext);
// 	// 		await user.click(btnPrevious);

// 	// 		expect(fixture.componentInstance.pagination().currentPage()).toBe(2);
// 	// 	});
// 	// });

// 	const renderPagination = async (
// 		nrOfItemsPerPage = 5,
// 	): Promise<RenderResult<NgxSignalPaginationAsyncComponent<AsyncData<Show>>>> => {
// 		let query = {
// 			isSuccess: signal(true),
// 			isError: signal(false),
// 			isPending: signal(false),
// 			isLoading: signal(false),
// 			isFetching: signal(false),
// 			isPlaceholderData: signal(false),
// 			data: signal(resolve),
// 		} as unknown as CreateQueryResult<AsyncData<Show>, Error>;

// 		return (await render<NgxSignalPaginationAsyncComponent<AsyncData<Show>>>(NgxSignalPaginationAsyncComponent, {
// 			inputs: { query, config: { nrOfItemsPerPage } },
// 			providers: [{ provide: SimpleQueryStringService, useValue: simpleQueryStringServiceMock }],
// 		})) as RenderResult<NgxSignalPaginationAsyncComponent<AsyncData<Show>>>;
// 	};
// });
