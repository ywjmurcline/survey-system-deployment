const { render, screen, fireEvent } = require('@testing-library/react');
const Register = require('../../pages/Register');

test('renders signup form and submits', () => {
    render(<Register />);
    const input = screen.getByLabelText(/email/i);
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    const button = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(button);
    expect(screen.getByText(/thank you for signing up/i)).toBeInTheDocument();
});