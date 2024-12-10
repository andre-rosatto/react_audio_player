import { useEffect } from "react";


export default function useAnimationFrame(
	updateFunction: () => void,
	playing: boolean = true
) {
	useEffect(() => {
		let updateHandle: number;
		const updateFrame = () => {
			updateFunction();
			updateHandle = requestAnimationFrame(updateFrame);
		}
		if (playing) {
			updateHandle = requestAnimationFrame(updateFrame);
		}

		return () => cancelAnimationFrame(updateHandle);
	}, [playing, updateFunction]);
}