import { CSSProperties, useEffect, useState } from "react";
import WaveForm from "./WaveForm";

interface WavePlayerProps {
	url: string;
}

const audioContext = new AudioContext();
const audio = new Audio();

export default function WavePlayer({ url }: WavePlayerProps) {
	const [currentBuffer, setCurrentBuffer] = useState<AudioBuffer | null>(null);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [playing, setPlaying] = useState<boolean>(false);

	useEffect(() => {
		audio.src = url;
		fetch(url)
			.then(response => response.arrayBuffer())
			.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
			.then(audioBuffer => {
				setCurrentBuffer(audioBuffer);
				setCurrentTime(0);
			})
			.catch((err) => {
				setCurrentBuffer(null);
				console.error(`Error loading audio from ${url}:\n${err}`);
			});
	}, [url]);

	useEffect(() => {
		let updateHandle: number;
		const audioUpdate = () => {
			setCurrentTime(audio.currentTime);
			updateHandle = requestAnimationFrame(audioUpdate);
		}
		if (playing) {
			updateHandle = requestAnimationFrame(audioUpdate);
		}

		return () => cancelAnimationFrame(updateHandle);
	}, [playing]);

	const styles: {
		base: CSSProperties,
		button: CSSProperties,
		waveformContainer: CSSProperties,
	} = {
		base: {
			display: 'flex',
			width: '100%',
			height: '100%',
			padding: '0.1rem 0',
			boxSizing: 'border-box',
			gap: '0.5rem'
		},
		button: {
			height: '100%',
			aspectRatio: 1,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			padding: '0.15rem'
		},
		waveformContainer: {
			flex: 1
		}
	}

	const handlePlayClick = () => {
		if (playing) {
			audio.pause();
		} else {
			audio.play();
		}
		setPlaying(!playing);
	}

	return (
		<div style={styles.base}>
			<button
				style={styles.button}
				onClick={handlePlayClick}
			>{ playing
					? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
							<path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
						</svg>
					: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
							<path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
						</svg>
			}</button>
			<div style={styles.waveformContainer}>
				<WaveForm
					audioBuffer={currentBuffer}
					currentTime={currentTime}
				/>
			</div>
		</div>
	);
}