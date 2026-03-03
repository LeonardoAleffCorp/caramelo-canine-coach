import { Component, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
          <span className="text-6xl mb-4">🐾</span>
          <h1 className="text-2xl font-extrabold text-foreground">Ops! Algo deu errado</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            Ocorreu um erro inesperado. Tente recarregar a página.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl"
          >
            Recarregar 🔄
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
