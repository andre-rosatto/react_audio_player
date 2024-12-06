import { useState } from 'react';
import './App.css';
import WavePlayer from './components/WavePlayer';
import { albums } from './albums';
import AlbumList from './components/AlbumList';

export default function App() {
	const [albumIdx, setAlbumIdx] = useState(0);
	const [trackIdx, setTrackIdx]= useState(0);

	const handleAlbumClick = (idx: number): void => {
		setAlbumIdx(idx);
	}

  return (
    <div className="App">
			<div className="player-container">
				<WavePlayer
					url={`./audio/${albums[albumIdx].folder}/${albums[albumIdx].tracks[trackIdx]}`}
				/>
			</div>
			<div className='tracks-container'>
				<AlbumList
					albums={albums}
					selectedIdx={albumIdx}
					onAlbumClick={setAlbumIdx}
				/>
				<div style={{backgroundColor: '#666'}}></div>
			</div>
    </div>
  );
}