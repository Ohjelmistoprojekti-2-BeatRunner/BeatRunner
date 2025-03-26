import { useState } from "react";

export function useScores() {

const [score, setScore] = useState<number>(0);
const [lastScores, setLastscores] = useState<number[]>([]);

const calculateScore = (stepScore: number) => {

    const points: number = stepScore * 100;

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

}

const endLevel = () => {

    setScore(0);
    setLastscores([]);
}

return { score, calculateScore, endLevel }

}
