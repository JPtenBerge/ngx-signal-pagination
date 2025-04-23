import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SimpleQueryStringService {
	// not using Angular's RouterModule because
	// 1. we're only doing a few tiny URL modifications.
	// 2. RouterModule is currently still Observable-based
	// 3. until it's an issue, I'm not that worried about overriding other querystring search params
	getPageFromQueryString(): number | null {
		let urlParams = new URLSearchParams(window.location.search);
		let page = urlParams.get('page');
		return page ? +page : null;
	}
	setPageInQueryString(page: number) {
		let path = window.location.pathname;
		let urlParams = new URLSearchParams(window.location.search);
		let hash = window.location.hash;

		if (page === 1) {
			window.history.pushState({}, '', `${path}${hash}`);
		} else {
			urlParams.set('page', page.toString());
			window.history.pushState({}, '', `${path}?${urlParams.toString()}${hash}`);
		}
	}
}
