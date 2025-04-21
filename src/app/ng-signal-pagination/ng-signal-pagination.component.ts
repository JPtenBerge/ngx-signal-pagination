import {
	ChangeDetectionStrategy,
	Component,
	computed,
	contentChild,
	inject,
	input,
	Signal,
	signal,
	TemplateRef,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';

import { PaginationOptions } from '../types/pagination-options';
import { Router } from '@angular/router';
@Component({
	selector: 'ng-signal-pagination',
	imports: [NgClass, NgTemplateOutlet],
	templateUrl: './ng-signal-pagination.component.html',
	styleUrl: './ng-signal-pagination.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgSignalPaginationComponent<T> {
	router = inject(Router);

	data = input.required<T[]>();
	config = input.required<PaginationOptions>();

	paginationTemplate = contentChild<
		TemplateRef<{
			currentPage: Signal<number>;
			pages: Signal<number[]>;
			next: () => void;
			previous: () => void;
		}>
	>('paginationTemplate');

	currentPage = signal(1);
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
	}

	goTo(page: number) {
		this.currentPage.set(page);
		this.router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' });
	}

	next() {
		this.currentPage.update(current => current + 1);
	}

	previous() {
		this.currentPage.update(current => current - 1);
	}
}
