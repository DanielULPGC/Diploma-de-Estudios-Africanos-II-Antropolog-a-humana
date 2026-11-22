import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  { children: ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Error de renderizado en Diploma de Estudios Africanos:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-canvas text-ink flex items-center justify-center p-6">
          <div className="max-w-lg w-full bg-paper border border-hairline border-t-2 border-t-ochre p-6 flex flex-col gap-4">
            <span className="font-mono text-xs text-ochre">
              Diploma de Estudios Africanos · ULPGC
            </span>
            <h1 className="font-display text-2xl font-semibold text-ink m-0">
              Se ha producido una incidencia inesperada en la vista
            </h1>
            <p className="text-sm leading-relaxed text-ink-muted m-0">
              Sus notas locales de seminario y sesiones DEA permanecen guardadas en el navegador.
              Recargue la página para restablecer la interfaz.
            </p>
            <div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-ink rounded hover:bg-ochre transition-colors cursor-pointer"
              >
                Recargar aplicación
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
