# ngx-signal-pagination

Pagination for Angular, powered by signals 🚦

## Features

- All signals, no RxJS
- Works with in-memory data as well as fetching data from server on page change
  - With the help of [@tanstack/angular-query-experimental](https://tanstack.com/query/latest/docs/framework/angular/overview)
- Keep it simple by using the predefined template
- Take control by rolling with your own template
- Page number is reflected in URL
  - Not using the `RouterModule` for this as it uses RxJS

### Caveats

- Page number is reflected in URL, but is not unique for all pagination controls. Having multiple pagination controls on one page is not currently supported.

### Todos

- Deploy a live demo site
- Deploy an example project
- Add something like 3 default templates
- Default asynchronous template could use a better loading indicator
- Improve type-safety with custom template. These `let-...` are currently of type `any`.
  ```html
  <ng-template
    #paginationTemplate
    let-currentPage="currentPage"
  ```
- Improve type-safety with asynchronous data retrieval. Your query should return this format for pagination to work:
  ```ts
  this.todoDal
    .getAll(this.pageChanges() ?? this.simpleQueryStringService.getPageFromQueryString() ?? 1)
    .then(res => ({
      pagedData: res.todos,
      currentPage: res.currentPage,
      nrOfPages: res.nrOfPages,
  }));
  ```
  That's currently not clear, the `query` parameter now accepts anything defined through `injectQuery()`.
  ```ts
  query = input.required<CreateQueryResult<T, any>>();
  ```
  Due to angular-query's type narrowing, it's a bit tricky to customize this.

## Installation

```sh
npm install ngx-signal-pagination
```

## Usage

### With in-memory data

First, the TypeScript bits - import the pagination component, define data and define pagination config:

```ts
@Component({
    selector: 'omg-awesome',
    imports: [NgxSignalPaginationComponent],
    templateUrl: './awesome.component.html',
})
export class AwesomeComponent {
    shows = [
        { title: 'Game of Thrones', rating: 9.5 },
        { title: 'Black Mirror', rating: 9.5 },
        /* ... */
    ];
    paging: PaginationOptions = { nrOfItemsPerPage: 5 };
}
```

Then you can either use the default template:

```html
<ngx-signal-pagination [data]="shows" [config]="paging" #pagination />
<ul class="list-[square] ml-4">
    @for (show of pagination.pageData(); track show.title) {
        <li>{{ show.title }} gets a {{ show.rating }}</li>
    }
</ul>
```

Alternatively, you can roll your own template:

```html
<ngx-signal-pagination [data]="shows" [config]="paging" #paginationCustomTemplate>
    <ng-template
        #paginationTemplate
        let-currentPage="currentPage"
        let-pages="pages"
        let-previous="previous"
        let-next="next"
        let-goTo="goTo"
    >
        <ol class="flex">
            <li class="p-3" (click)="previous()">previous</li>
                @for (page of pages(); track page) {
                    <li class="p-3 border-solid border-amber-300 border-b-2" [class.bg-amber-300]="page === currentPage()" (click)="goTo(page)">
                        {{ page }}
                    </li>
                }
            <li class="p-3" (click)="next()">next</li>
        </ol>
    </ng-template>
</ngx-signal-pagination>
<ul class="list-[square] ml-4">
    @for (show of paginationCustomTemplate.pageData(); track show.title) {
         <li>{{ show.title }} gets a {{ show.rating }}</li>
    }
</ul>
```

### With asynchronous data retrieval

Asynchronous data retrieval works using the [@tanstack/angular-query-experimental](https://tanstack.com/query/latest/docs/framework/angular/overview) library. You'll need to define your query, as well as do a bit of page change handling*. 

<sub>*I've tried exposing a signal from the pagination component, but this signal not always being there due to the rendering lifecycle made this approach quite cumbersome.</sub>

First, the TypeScript bits - import the *async* pagination component, define your and define pagination config:

```ts
@Component({
    selector: 'omg-awesome',
    imports: [NgxSignalPaginationAsyncComponent],
    templateUrl: './awesome.component.html',
})
export class AwesomeComponent {
	private todoDal = inject(TodoDal);
	private simpleQueryStringService = inject(SimpleQueryStringService);
    paging: PaginationOptions = { nrOfItemsPerPage: 5 };

    pageChanges = signal<number | null>(null);

    todoQuery = injectQuery(() => ({
        queryKey: ['todos', this.pageChanges() ?? this.simpleQueryStringService.getPageFromQueryString() ?? 1],
        queryFn: () => this.todoDal.getTodos(this.pageChanges() ?? this.simpleQueryStringService.getPageFromQueryString() ?? 1),
        placeholderData: prev => prev,
    }));

    goToPage(p: number) {
        this.pageChanges.set(p);
    }
}
```
In this scenario, my `TodoDal` looks like this:

```ts
@Injectable({ providedIn: 'root' })
export class TodoDal {
	#todos = [
		'#1 Clean the house',
		'#2 Eat food',
		'#3 Exercise',
		/* ... */
	];

	getTodos(page: number): Promise<{ pagedData: any[], currentPage: number; nrOfPages: number; }> {
		return new Promise(resolve => {
			setTimeout(() => {
				resolve({
					pagedData: this.#todos.slice((page - 1) * 5, page * 5),
					currentPage: page,
					nrOfPages: Math.ceil(this.#todos.length / 5),
				});
			}, 2000);
		});
	}
}

```

Then you can either use the default template:

```html
<ngx-signal-async-pagination [query]="todoQuery" (pageChange)="goToPage($event)" [config]="paging" #asyncPagination />
<ul class="list-[square] ml-4">
    @for (todo of asyncPagination.pageData(); track todo) {
        <li>{{ todo }}</li>
    }
</ul>
```

Or roll a custom template as with the in-memory variant.
