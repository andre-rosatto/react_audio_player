import { useEffect, useState } from 'react';
import './App.css';
import WavePlayer from './components/WavePlayer';
import { albums } from './albums';

type Track = {
	title: string;
	duration: string;
}

const sliceBuffer = (arrayBuffer: ArrayBuffer, from: number, size?: number): string => {
	const dv = new DataView(arrayBuffer);
	let result = '';
	for (let i = from; i > (size ? from - size : 0); i--) {
		const byte = dv.getUint8(dv.byteLength - i);
		if (byte === 0) {
			break;
		} else {
			result += String.fromCharCode(byte);
		}
	}
	return result;
}

export default function App() {
	const [albumIdx, setAlbumIdx] = useState(0);
	const [trackIdx, setTrackIdx]= useState(0);
	const [tracks, setTracks] = useState<Track[]>([]);

	useEffect(() => {
		let ignore: boolean = false;
		setTracks(albums[albumIdx].tracks.map(track => {
			return {title: track, duration: '...'}
		}));
		const audioContext = new AudioContext();

		const fetchAudioData = (idx: number) => {
			fetch(`./audio/${albums[albumIdx].folder}/${albums[albumIdx].tracks[idx]}`)
				.then(res => res.arrayBuffer())
				.then(arrayBuffer => {
					if (ignore) return;
					if (sliceBuffer(arrayBuffer, 128, 3) === 'TAG') {
						const title = sliceBuffer(arrayBuffer, 125);
						audioContext.decodeAudioData(arrayBuffer, audioBuffer => {
							if (ignore) return;
							const seconds = Math.floor(audioBuffer.duration % 60);
							const minutes = Math.floor(audioBuffer.duration / 60);
							const duration = `${minutes}:${seconds.toString().padStart(2, '0')}`;
							setTracks(item => item.map((t, i) => i === idx ? {title, duration} : t));
							if (idx < albums[albumIdx].tracks.length - 1) {
								fetchAudioData(idx + 1);
							}
						});
					} else {
						console.log('no metadata');
					}
				});
		}

		fetchAudioData(0);

		return () => {
			ignore = true;
		}
	}, [albumIdx]);

  return (
    <div className="App">
			<div className="player-container">
				<WavePlayer
					url={`./audio/${albums[albumIdx].folder}/${albums[albumIdx].tracks[trackIdx]}`}
				/>
			</div>

			<div className='tracks-container'>
				{/* album listing */}
				<ul>
					{albums.map((album, idx) =>
						<li
							key={idx}
							className={albumIdx === idx ? 'selected-item' : ''}
							onClick={() => {
								setAlbumIdx(idx);
								setTrackIdx(0);
							}}
						>
							<img
								src={`./audio/${album.folder}/${album.coverUrl}`}
								alt={`${album.title} cover`}
								title={`${album.title}`}
							/>
							{album.title}
						</li>
					)}
				</ul>

				{/* track listing */}
				<ul>
					{tracks.map((track, idx) =>
						<li
							key={idx}
							className={trackIdx === idx ? 'track selected-item' : 'track'}
							onClick={() => setTrackIdx(idx)}
						>
							<span>{track.title}</span>
							<span>{track.duration}</span>
						</li>
					)}
				</ul>
			</div>
    </div>
  );
}