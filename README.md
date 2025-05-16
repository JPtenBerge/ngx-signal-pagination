# ngx-signal-pagination

Pagination for Angular, powered by signals 🚦.

Note: this is my first public npm project. I'm working on TypeScript types.

## Features

- Works with in-memory data as well as fetching data from server on page change
  - With the help of [@tanstack/angular-query-experimental](https://tanstack.com/query/latest/docs/framework/angular/overview)
- Keep it simple by using the predefined template
- Take control by rolling with your own template
- Page number is reflected in URL

### Caveats

- Page number is reflected in URL, but is not unique for all pagination controls. Having multiple pagination controls on one page is not currently supported.

## Installation

```sh
npm install ngx-signal-pagination
```

## Usage

Import the pagination components with your components:

```ts
@Component({
    selector: 'omg-awesome',
    imports: [NgxSignalPaginationComponent, NgxSignalPaginationAsyncComponent],
    templateUrl: './awesome.component.html',
})
export class AwesomeComponent {	/* ... */ }
```

### With in-memory data

```html
<ngx-signal-pagination [data]="shows" [config]="paging" #pagination />
<ul class="list-[square] ml-4">
    @for (show of pagination.pageData(); track show.title) {
        <li>{{ show.title }} gets a {{ show.rating }}</li>
    }
</ul>
```

### With in-memory data and a custom template

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

```html
<ngx-signal-async-pagination [query]="todoQuery" (pageChange)="goToPage($event)" [config]="paging" #asyncPagination />
<ul class="list-[square] ml-4">
    @for (todo of asyncPagination.pageData(); track todo) {
        <li>{{ todo }}</li>
    }
</ul>
```
