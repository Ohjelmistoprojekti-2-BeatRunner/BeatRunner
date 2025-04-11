import { useState } from 'react';
import { useDatabase } from './useDatabase';


export function useScores() {

    const [score, setScore] = useState<number>(0);
    const [lastScores, setLastscores] = useState<number[]>([]);

    const { submitRunScore } = useDatabase();


    // Calculate numeric value for how close step is to beat (0 = perfect step, 0.5 = missed step)
    const calculateStepScore = (timeStamp: number, bpm: number) => {

        // How many times beat plays in second
        const bps = 60 / bpm;

        // Calculate multiplier to result
        const multiplier = bpm / 60;

        // Calculate how close step is to beat 
        const result = ((timeStamp / 1000) % bps) * multiplier;

        // If result is under 0.5 call calculateScore 1-result
        if (result < 0.5) {
            calculateScore(1 - result);
        } else {
            calculateScore(result);
        };

    };

    // Calculate score from stepScore
    const calculateScore = (stepScore: number) => {

        const points: number = Math.round(stepScore * 100);

        setLastscores(prevLastScores => {
            if (points === 100) {
                // Add full points to list, so we know if bonus is eligble
                const updatedScores = [...prevLastScores, points].slice(-10);

                if (updatedScores.length === 10 && updatedScores.every(p => p === 100)) {
                    // If last 10 points are 100, add 5x bonus
                    setScore(prevScore => prevScore + points * 5);
                } else {
                    // Otherwise add normal points to score
                    setScore(prevScore => prevScore + points);
                }

                return updatedScores;
            } else {
                // If points are under 100 add normal points + empty list of previous scores
                setScore(prevScore => prevScore + points);
                return [];
            }
        });

    };


    // end level and Reset points 
    const endLevel = (levelId: string) => {
        submitRunScore(score, levelId)
        setScore(0);
        setLastscores([]);
    };

    return { score, calculateStepScore, endLevel };

}
