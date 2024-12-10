import { CSSProperties, useEffect, useState } from "react";
import WaveForm from "./WaveForm";
import useAnimationFrame from "../hooks/useAnimationFrame";

interface WavePlayerProps {
	url: string;
}

const audioContext = new AudioContext();
const audio = new Audio();

export const formatDuration = (length: number): string => {
	const seconds = Math.floor(length % 60);
	const minutes = Math.floor(length / 60);
	return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function WavePlayer({ url }: WavePlayerProps) {
	const [currentBuffer, setCurrentBuffer] = useState<AudioBuffer | null>(null);
	const [currentTime, setCurrentTime] = useState<number>(0);
	const [playing, setPlaying] = useState<boolean>(false);

	useAnimationFrame(() => {
		setCurrentTime(audio.currentTime);
		if (audio.currentTime >= audio.duration) {
			setPlaying(false);
		}
	}, playing);

	useEffect(() => {
		audio.src = url;
		fetch(url)
			.then(response => response.arrayBuffer())
			.then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
			.then(audioBuffer => {
				setCurrentBuffer(audioBuffer);
				setCurrentTime(0);
				setPlaying(false);
			})
			.catch((err) => {
				setCurrentBuffer(null);
				console.error(`Error loading audio from ${url}:\n${err}`);
			});
	}, [url]);

	const styles: {
		base: CSSProperties,
		button: CSSProperties,
		buttonIcon: CSSProperties,
		waveformContainer: CSSProperties,
		timeContainer: CSSProperties
	} = {
		base: {
			display: 'flex',
			width: '100%',
			height: '100%',
			padding: '0.1rem 0',
			boxSizing: 'border-box',
			gap: '0.5rem',
		},
		button: {
			height: '100%',
			aspectRatio: 1,
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			padding: '0.15rem',
			borderRadius: '100%',
			border: '1px solid #bebebe',
			backgroundColor: 'transparent',
			color: '#bebebe',
			cursor: 'pointer'
		},
		buttonIcon: {
			width: '75%'
		},
		waveformContainer: {
			flex: 1,
			position: 'relative'
		},
		timeContainer: {
			display: 'flex',
			justifyContent: 'space-between',
			fontSize: '0.75rem',
			position: 'absolute',
			bottom: '-0.5rem',
			width: '100%',
			textShadow: '0 1px black, 0 -1px black, 1px 0 black, -1px 0 black'
		}
	}

	const handlePlayClick = (): void => {
		if (playing) {
			audio.pause();
		} else {
			audio.play();
		}
		setPlaying(!playing);
	}

	const handleWaveFormClick = (time: number) => {
		audio.currentTime = time;
		setCurrentTime(time);
	}

	return (
		<div style={styles.base}>
			<button
				style={styles.button}
				onClick={handlePlayClick}
			>{ playing
					? <svg style={styles.buttonIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
							<path fillRule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clipRule="evenodd" />
						</svg>
					: <svg style={styles.buttonIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
							<path fillRule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
						</svg>
			}</button>
			<div style={styles.waveformContainer}>
				<WaveForm
					audioBuffer={currentBuffer}
					currentTime={currentTime}
					playedColor="#bebebe"
					cursorColor="white"
					onClick={handleWaveFormClick}
				/>
				<div style={styles.timeContainer}>
					<span>{formatDuration(currentTime)}</span>
					<span>{formatDuration(audio.duration)}</span>
				</div>
			</div>
		</div>
	);
}