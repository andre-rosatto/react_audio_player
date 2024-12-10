import { useCallback, useEffect } from "react";


export default function useAnimationFrame(
	updateFunction: () => void,
	playing: boolean = true
) {
	const update = useCallback(() => updateFunction(), [updateFunction]);

	useEffect(() => {
		let updateHandle: number;
		const updateFrame = () => {
			update();
			updateHandle = requestAnimationFrame(updateFrame);
		}
		if (playing) {
			updateHandle = requestAnimationFrame(updateFrame);
		}

		return () => cancelAnimationFrame(updateHandle);
	}, [playing]);
}