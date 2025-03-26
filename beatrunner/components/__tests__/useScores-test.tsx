import { render, fireEvent, screen } from '@testing-library/react-native'; 
import { useScores } from "@/hooks/useScores"
import { View, Text, Button } from "react-native";

const TestComponent = () => {
    const {score, calculateScore, endLevel} = useScores();

    return (
        <View>
            <Text testID="score">{score}</Text>
            <Button title="Add 100 points" onPress={() => calculateScore(1)} />
            <Button  title="Add 50 points" onPress={() => calculateScore(0.5)}/>
            <Button title="End level" onPress={endLevel}/>
        </View>
    );
};

//Testing useScores hook using React test library
describe('useScores Hook', () => {
    test('Starting score should be 0', () => {
        render(<TestComponent />);
        
        const scoreElement = screen.getByTestId('score');
        
        expect(scoreElement).toHaveTextContent('0');
    });

    test('Adding 100 points should increase the score by 100', () => {
        render(<TestComponent />);
        
        const scoreElement = screen.getByTestId('score');
        
        fireEvent.press(screen.getByText('Add 100 points'));
        
        expect(scoreElement).toHaveTextContent('100');

    });

    test('EndLevel should reset score', () => {
        render(<TestComponent />);
        
        const scoreElement = screen.getByTestId('score');
        
        fireEvent.press(screen.getByText('End level'));
        
        expect(scoreElement).toHaveTextContent('0');
    });
});