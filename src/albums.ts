type Album = {
	title: string;
	folder: string;
	coverUrl: string;
	tracks: string[];
}

export const albums: Album[] = [
	{
		title: 'English Gateway 1',
		folder: 'eg1',
		coverUrl: 'eg1_cover.jpg',
		tracks: [
			'1.1.mp3', '1.2.mp3', '1.3.mp3', '1.4.mp3', '1.5.mp3', '1.6.mp3'
		]
	}
];