import { Injectable } from '@angular/core';
import { AsyncData } from '../types/async-data';

@Injectable({ providedIn: 'root' })
export class TodoService {
	#todos = [
		'#1 Clean the house',
		'#2 Eat food',
		'#3 Exercise',
		'#4 Sleep',
		'#5 Look at clock',
		'#6 Work',
		'#7 Clean fridge',
		'#8 Drink tea',
		'#9 Drink coffee',
		'#10 Drink water',
		'#11 Sleep some more',
		'#12 Sleep again',
		'#13 Sleep way more',
		'#14 Recover with sleep',
		'#15 Boil water',
		'#16 Shower',
		'#17 Dress',
		'#18 Load dishwasher',
		'#19 Empty dishwasher',
		'#21 Call mom',
		'#22 See a good show',
		'#23 See an terrible show',
		'#24 Eat breakfast',
		'#25 Skip lunch',
		'#26 Order dinner',
		'#27 Clean apartment',
	];

	getTodos(page: number): Promise<AsyncData<string>> {
		console.log('[todoservice] getTodos', page);
		return new Promise(res => {
			setTimeout(() => {
				res({
					pagedData: this.#todos.slice((page - 1) * 5, page * 5),
					currentPage: page,
					nrOfPages: Math.ceil(this.#todos.length / 5),
				});
			}, 2000);
		});
	}
}
