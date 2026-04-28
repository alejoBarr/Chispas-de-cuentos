import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error capturado por el control:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-purple-50">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-bold text-purple-800 mb-2">¡Oh, no! El libro mágico se ha atascado</h2>
          <p className="text-gray-600 mb-6">Ha ocurrido un error inesperado al cargar la magia.</p>
          <button
            className="px-8 py-3 bg-pink-500 text-white font-bold rounded-full shadow-lg hover:bg-pink-600 transition-transform transform hover:scale-105"
            onClick={() => window.location.reload()}
          >
            Reiniciar la Aventura
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}