import { Show } from './show';

export const getShows = (): Show[] => {
	return [
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
};
