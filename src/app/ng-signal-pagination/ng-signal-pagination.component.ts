import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { PaginationOptions } from '../types/pagination-options';

@Component({
	selector: 'ng-signal-pagination',
	imports: [],
	templateUrl: './ng-signal-pagination.component.html',
	styleUrl: './ng-signal-pagination.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgSignalPaginationComponent<T> {
	data = input.required<T[]>();
	config = input.required<PaginationOptions>();

	currentPage = signal(1);
	pages = computed<number[]>(() =>
		Array.from({ length: Math.ceil(this.data().length / this.config().nrOfItemsPerPage) }, (_, index) => index + 1),
	);
	pageData = computed(() => {
		let start = (this.currentPage() - 1) * this.config().nrOfItemsPerPage;
		let end = start + this.config().nrOfItemsPerPage;
		return this.data().slice(start, end);
	});

	goToPage(page: number) {
		this.currentPage.set(page);
	}
}
