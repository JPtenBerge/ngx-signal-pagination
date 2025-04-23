import { computed, Signal } from '@angular/core';

// thanks to https://github.com/angular/angular/issues/54339#issuecomment-2071679580
export const computedWithPrev = <T>(computation: (prev: T) => T): Signal<T> => {
	let previous: T;
	return computed<T>(() => {
		const newValue = computation(previous);
		previous = newValue;
		return newValue;
	});
};
