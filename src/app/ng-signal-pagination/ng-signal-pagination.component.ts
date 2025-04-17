import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { computedWithPrev } from '../utils/computed-with-prev';

@Component({
	selector: 'ng-signal-pagination',
	imports: [],
	templateUrl: './ng-signal-pagination.component.html',
	styleUrl: './ng-signal-pagination.component.css',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgSignalPaginationComponent<T> {
	data = input.required<T[]>();
	nrOfItemsPerPage = input.required<number>();

	currentPage = signal(1);
	pages = computed<number[]>(() =>
		Array.from({ length: Math.ceil(this.data().length / this.nrOfItemsPerPage()) }, (_, index) => index + 1),
	);


}
