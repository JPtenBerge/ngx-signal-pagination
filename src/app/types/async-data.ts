export interface AsyncData<T> {
	pagedData: T[];
	currentPage: number;
	nrOfPages: number;
}
