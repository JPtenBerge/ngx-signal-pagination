import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';

import { NgSignalPaginationComponent } from './ng-signal-pagination/ng-signal-pagination.component';
import { PaginationOptions } from './types/pagination-options';
import { TodoService } from './services/todo.service';
import { NgSignalPaginationAsyncComponent } from './ng-signal-pagination-async/ng-signal-pagination-async.component';

@Component({
	selector: 'app-root',
	imports: [NgSignalPaginationComponent, NgSignalPaginationAsyncComponent],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css',
})
export class AppComponent {
	todoService = inject(TodoService);

	shows = [
		{ title: 'Game of Thrones', rating: 9.5 },
		{ title: 'Black Mirror', rating: 9.5 },
		{ title: 'Prison Break', rating: 7 },
		{ title: 'Lost', rating: 8 },
		{ title: 'Breaking Bad', rating: 9 },
		{ title: 'Better Call Saul', rating: 9 },
		{ title: 'Friends', rating: 8 },
		{ title: 'Dexter', rating: 7.5 },
		{ title: 'The Gentlemen', rating: 9 },
		{ title: 'Ozark', rating: 8 },
		{ title: 'Alice in Borderland', rating: 7.5 },
		{ title: 'Squid Game', rating: 7.5 },
		{ title: 'Now & Again', rating: 8 },
	];

	paging: PaginationOptions = { nrOfItemsPerPage: 5 };

	pageChanges = signal<number | null>(null);

	todoQuery = injectQuery(() => ({
		queryKey: ['todos', this.pageChanges()],
		queryFn: () => this.todoService.getTodos(this.pageChanges() ?? 1),
		placeholderData: prev => prev,
	}));

	goToPage(p: number) {
		console.log('[app] goToPage:', p);
		this.pageChanges.set(p);
	}
}
