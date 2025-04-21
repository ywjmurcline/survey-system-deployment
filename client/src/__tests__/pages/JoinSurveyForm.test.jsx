const { render, screen, fireEvent } = require('@testing-library/react');
const JoinSurveyForm = require('../../components/JoinSurveyForm');

test('renders join survey form and submits', () => {
    render(<JoinSurveyForm />);
    
    const input = screen.getByLabelText(/survey code/i);
    fireEvent.change(input, { target: { value: '12345' } });
    
    const button = screen.getByRole('button', { name: /join survey/i });
    fireEvent.click(button);
    
    expect(screen.getByText(/thank you for joining/i)).toBeInTheDocument();
});