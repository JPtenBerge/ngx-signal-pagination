import {
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	HostListener,
	inject,
	input,
	Signal,
	signal,
	TemplateRef,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';

import { PaginationOptions } from '../types/pagination-options';
import { SimpleQueryStringService } from '../services/simple-query-string.service';

@Component({
	selector: 'ngx-signal-pagination',
	imports: [NgClass, NgTemplateOutlet],
	templateUrl: './ngx-signal-pagination.component.html',
	styleUrl: './ngx-signal-pagination.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxSignalPaginationComponent<T> {
	simpleQueryString = inject(SimpleQueryStringService);

	data = input.required<T[]>();
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

	currentPage = signal(this.simpleQueryString.getPageFromQueryString() ?? 1);
	pages = computed<number[]>(() =>
		Array.from({ length: Math.ceil(this.data().length / this.config().nrOfItemsPerPage) }, (_, index) => index + 1),
	);
	pageData = computed(() => {
		let start = (this.currentPage() - 1) * this.config().nrOfItemsPerPage;
		let end = start + this.config().nrOfItemsPerPage;
		return this.data().slice(start, end);
	});

	constructor() {
		this.next = this.next.bind(this);
		this.previous = this.previous.bind(this);
		this.goTo = this.goTo.bind(this);
	}

	goTo(page: number) {
		this.currentPage.set(page);
		this.simpleQueryString.setPageInQueryString(this.currentPage());
	}

	next() {
		this.currentPage.update(current => current + 1);
		this.simpleQueryString.setPageInQueryString(this.currentPage());
	}

	previous() {
		this.currentPage.update(current => current - 1);
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
