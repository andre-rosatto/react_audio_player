import { CSSProperties, useEffect, useRef } from "react";

interface WaveFormProps {
	audioBuffer?: AudioBuffer | null;
	currentTime?: number;
	samples?: number;
	unplayedColor?: string;
	playedColor?: string;
	cursorColor?: string;
}

const filterData = (audioBuffer: AudioBuffer, samples: number): number[] => {
	const rawData = audioBuffer.getChannelData(0);
	const blockSize = Math.floor(rawData.length / samples);
	
	const filteredData = [];
	for (let i = 0; i < samples; i++) {
		let blockStart = blockSize * i;
		let sum = 0;
		for (let j = 0; j < blockSize; j++) {
			sum += Math.abs(rawData[blockStart + j]);
		}
		filteredData.push(sum / blockSize);
	}
	return filteredData;
}

const normalizeData = (filteredData: number[]) => {
	const multiplier = Math.pow(Math.max(...filteredData), -1);
	return filteredData.map(n => n * multiplier);
}

const draw = (
	canvas: HTMLCanvasElement,
	buffer: AudioBuffer | null,
	currentTime: number,
	samples: number,
	playedColor: string,
	unplayedColor: string,
	cursorColor: string
) => {
	const dpr = window.devicePixelRatio || 1;
	canvas.width = canvas.offsetWidth * dpr;
	canvas.height = canvas.offsetHeight * dpr;
	const position = buffer ? Math.min(currentTime, buffer.duration) * canvas.width / buffer.duration : 0;
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
	ctx.scale(dpr, dpr);
	ctx.translate(0, canvas.offsetHeight / 2);

	drawBaseline(ctx, position, canvas.offsetWidth, playedColor, unplayedColor);

	if (buffer) {
		const normalizedBuffer = normalizeData(filterData(buffer, samples));
		const width = canvas.offsetWidth / normalizedBuffer.length;
	
		for (let i = 0; i < normalizedBuffer.length; i++) {
			const x = width * i;
			let height = Math.min(normalizedBuffer[i] * canvas.offsetHeight, canvas.offsetHeight / 2);
			if (height <= 0) {
				continue;
			}
	
			ctx.lineWidth = 1;
			ctx.fillStyle = x < position ? playedColor : unplayedColor;
			ctx.fillRect(x, -height, width, height * 2);
		}
	}
	drawCursor(ctx, position, canvas.height, cursorColor);
}

const drawBaseline = (
	ctx: CanvasRenderingContext2D,
	position: number,
	width: number,
	playedColor: string,
	unplayedColor: string
) => {
	ctx.beginPath();
	ctx.lineWidth = 1;
	ctx.strokeStyle = playedColor;
	ctx.moveTo(0, 0);
	ctx.lineTo(position, 0);
	ctx.stroke();
	ctx.beginPath();
	ctx.strokeStyle = unplayedColor;
	ctx.moveTo(position, 0);
	ctx.lineTo(width, 0);
	ctx.stroke();
}

const drawCursor = (ctx: CanvasRenderingContext2D, position: number, height: number, color: string) => {
	ctx.lineWidth = 1;
	ctx.strokeStyle = color;
	ctx.beginPath();
	ctx.moveTo(position, height / 2);
	ctx.lineTo(position, -height / 2);
	ctx.stroke();
}

const WaveForm = ({
	audioBuffer = null,
	currentTime = 0,
	samples = 1000,
	unplayedColor = 'black',
	playedColor = 'blue',
	cursorColor = 'blue'
}: WaveFormProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		if (canvasRef.current) {
			draw(canvasRef.current, audioBuffer, currentTime, samples, playedColor, unplayedColor, cursorColor);
		}
	}, [audioBuffer, currentTime, samples, playedColor, unplayedColor, cursorColor]);

	const style: CSSProperties = {
		width: '100%',
		height: '100%'
	}

	return (
		<canvas
			ref={canvasRef}
			style={style}
		></canvas>
	)
}

export default WaveForm;