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
		waveformContainer: CSSProperties
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
			width: '3rem'
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
			>{playing ? 'Pause' : 'Play'}</button>
			<div style={styles.waveformContainer}>
				<WaveForm
					audioBuffer={currentBuffer}
					currentTime={currentTime}
				/>
			</div>
		</div>
	);
}