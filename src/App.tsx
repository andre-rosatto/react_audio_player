import { useState } from 'react';
import './App.css';
import WavePlayer from './components/WavePlayer';
import { albums } from './albums';

export default function App() {
	const [albumIdx, setAlbumIdx] = useState(0);
	const [trackIdx, setTrackIdx]= useState(0);

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
					{albums[albumIdx].tracks.map((track, idx) =>
						<li
							key={idx}
							className={trackIdx === idx ? 'track selected-item' : 'track'}
							onClick={() => setTrackIdx(idx)}
						>
							<span>{track}</span>
							<span>3.42</span>
						</li>
					)}
				</ul>
			</div>
    </div>
  );
}