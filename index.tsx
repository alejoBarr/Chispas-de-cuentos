import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Log de diagnóstico para confirmar que el script inició
console.log("Iniciando Chispas de Cuentos...");

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <div id="app-wrapper">
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </div>
    </React.StrictMode>
  );
} catch (error) {
  console.error("Fallo catastrófico al montar React:", error);
  // Fallback visual directo en el DOM si React falla totalmente
  rootElement.innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h2>😵 El libro mágico no pudo abrirse</h2>
      <p>Error de carga inicial. Por favor, refresca la página.</p>
    </div>`;
}
