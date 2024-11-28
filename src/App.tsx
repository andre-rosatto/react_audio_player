import { useState } from 'react';
import './App.css';
import WavePlayer from './components/WavePlayer';
import { albums } from './albums';

export default function App() {
	const [album, setAlbum] = useState(albums[0]);
	const [track, setTrack]= useState(0);

  return (
    <div className="App">
			<div className="player-container">
				<WavePlayer
					url={`./audio/${album.folder}/${album.tracks[track]}`}
				/>
			</div>

			{/* <img
				src={`./audio/${album.folder}/${album.coverUrl}`}
				alt=""
			/> */}
    </div>
  );
}