import {
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	effect,
	HostListener,
	inject,
	input,
	linkedSignal,
	output,
	Signal,
	TemplateRef,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';

import { PaginationOptions } from '../types/pagination-options';
import { SimpleQueryStringService } from '../services/simple-query-string.service';
import { CreateQueryResult } from '@tanstack/angular-query-experimental';
import { computedWithPrev } from '../utils/computed-with-prev';

@Component({
	selector: 'ngx-signal-async-pagination',
	imports: [NgClass, NgTemplateOutlet],
	templateUrl: './ngx-signal-pagination-async.component.html',
	styleUrl: './ngx-signal-pagination-async.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxSignalPaginationAsyncComponent<T> {
	simpleQueryString = inject(SimpleQueryStringService);

	query = input.required<CreateQueryResult<T, any>>();
	config = input.required<PaginationOptions>();
	paginationTemplate = contentChild<
		TemplateRef<{
			currentPage: Signal<number>;
			pages: Signal<number[]>;
			next: () => void;
			previous: () => void;
			goTo: (page: number) => void;
		}>
	>('paginationTemplate');

	currentPage = linkedSignal(() => {
		if (this.query().isSuccess() && this.query().data()) {
			return this.query().data().currentPage;
		}

		return this.simpleQueryString.getPageFromQueryString() ?? 1;
	});
	pageChange = output<number>();
	pages = computedWithPrev<number[]>(prev => {
		if (this.query().isPending()) return prev ?? [1];
		if (this.query().isError()) return [1];

		return Array.from({ length: this.query().data().nrOfPages }, (_, index) => index + 1);
	});
	pageData = computed(() => {
		if (!this.query().data()) return null;
		if (!('pagedData' in this.query().data())) return null;

		console.log('pageData', this.query().data());
		return this.query().data().pagedData;
		// let start = (this.currentPage() - 1) * this.config().nrOfItemsPerPage;
		// let end = start + this.config().nrOfItemsPerPage;
		// return this.data().slice(start, end);
	});

	constructor() {
		this.next = this.next.bind(this);
		this.previous = this.previous.bind(this);
		this.goTo = this.goTo.bind(this);

		effect(() => {
			console.log('andere data', this.query().data());
		});
	}

	goTo(page: number) {
		this.pageChange.emit(page);
		this.simpleQueryString.setPageInQueryString(this.currentPage());
	}

	next() {
		this.pageChange.emit(this.currentPage() + 1);
		this.simpleQueryString.setPageInQueryString(this.currentPage());
	}

	previous() {
		this.pageChange.emit(this.currentPage() - 1);
		this.simpleQueryString.setPageInQueryString(this.currentPage());
	}

	@HostListener('window:popstate')
	updatePage() {
		let page = this.simpleQueryString.getPageFromQueryString();
		if (page && page !== this.currentPage()) {
			this.currentPage.set(page);
		}
	}
}
