import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

export function useStepAccuracy() {
	const [stepScoresWithTimestamps, setStepScoresWithTimestamps] = useState<Array<{score: number, timestamp: number}>>([]);
	const isPlayingRef = useRef(false);
	const currentBpmRef = useRef(0);
	const [sound, setSound] = useState<Audio.Sound | null>(null);

    useEffect(() => {
        let loadedSound: Audio.Sound | null = null;
        Audio.Sound.createAsync(require('@/assets/sounds/step.mp3'), { volume: 0.1 })
            .then(({ sound }) => {
                loadedSound = sound;
                setSound(sound);
            })
            .catch(error => console.error("Error loading sound"));
        return () => {
            if (loadedSound) loadedSound.unloadAsync();
        };
    }, []);

	const playSingleSound = async (bpm: number): Promise<boolean> => {
		if (!sound) return false;
		try {
			await sound.stopAsync().catch(() => {});
			await sound.setPositionAsync(0);
			await sound.setRateAsync(Math.max(0.5, Math.min(2.0, bpm / 60)), false);
			await sound.setVolumeAsync(0.1);
			await sound.playAsync();
			return true;
		} catch {
			return false;
		}
	};

	const playBeepSequence = async (beepIndex: number, totalBeeps: number, bpm: number) => {
		if (beepIndex >= totalBeeps || !isPlayingRef.current) {
			isPlayingRef.current = false;
			return;
		}
		await playSingleSound(bpm);
		const delayMs = Math.round((60 / bpm) * 1000);
		setTimeout(() => playBeepSequence(beepIndex + 1, totalBeeps, bpm), delayMs);
	};

	const startTempoSoundSequence = async (bpm: number) => {
		if (isPlayingRef.current || !sound) return;
		
		isPlayingRef.current = true;
		currentBpmRef.current = bpm;
		playBeepSequence(0, 5, bpm);
	};

	const calculateStepScore = (timestamp: number, bpm: number): number => {
		const bps = 60 / bpm;
		const multiplier = bpm / 60;
		const result = ((timestamp / 1000) % bps) * multiplier;
		const stepScore = result < 0.5 ? 1 - result : result;
		return Math.round(stepScore * 100);
	};

	const processStep = async (timestamp: number, bpm: number) => {
		if (!sound) return;
		const points = calculateStepScore(timestamp, bpm);
		setStepScoresWithTimestamps(prev => {
			const updatedSteps = [...prev, { score: points, timestamp }];
			const latestSteps = updatedSteps.slice(-10);
			
			if (latestSteps.length === 10) {
				const sortedSteps = [...latestSteps].sort((a, b) => a.timestamp - b.timestamp);
				const timeSpanMs = sortedSteps[9].timestamp - sortedSteps[0].timestamp;
				const withinTimeWindow = timeSpanMs <= 10000;
				const lowCount = latestSteps.filter(step => step.score < 75).length;
				if (withinTimeWindow && lowCount >= 7 && !isPlayingRef.current) {
					startTempoSoundSequence(bpm);
				}
			}
			return latestSteps;
		});
	};
	return { 
		processStep, 
		lastStepScores: stepScoresWithTimestamps.map(item => item.score) 
	};
}
