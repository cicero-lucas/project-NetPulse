import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../components/ui/Button';
import { Badge, Card } from '../components/ui/Card';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Clique aqui</Button>);
    expect(screen.getByText('Clique aqui')).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading', () => {
    const { container } = render(<Button isLoading>Salvar</Button>);
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('is disabled when isLoading', () => {
    render(<Button isLoading>Salvar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Clique</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    const { container } = render(<Button variant="danger">Deletar</Button>);
    expect(container.firstChild).toHaveClass('bg-red-600');
  });
});

describe('Badge', () => {
  it('renders label', () => {
    render(<Badge label="Online" className="bg-green-500/20 text-green-400" />);
    expect(screen.getByText('Online')).toBeInTheDocument();
  });
});

describe('Card', () => {
  it('renders children', () => {
    render(<Card><p>Conteúdo</p></Card>);
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });
});
