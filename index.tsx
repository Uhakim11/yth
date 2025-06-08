import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { TalentProvider } from './contexts/TalentContext';
import { AlertProvider } from './contexts/AlertContext';
import { CompetitionProvider } from './contexts/CompetitionContext';
import { WorkshopProvider } from './contexts/WorkshopContext';
import { ResourceProvider } from './contexts/ResourceContext';
import { AccentColorProvider } from './contexts/AccentColorContext'; 

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  // <React.StrictMode> // Removed StrictMode
    <HashRouter>
      <ThemeProvider>
        <AccentColorProvider> 
          <AlertProvider>
            <AuthProvider>
              <TalentProvider>
                <CompetitionProvider>
                  <WorkshopProvider>
                    <ResourceProvider>
                        <App />
                    </ResourceProvider>
                  </WorkshopProvider>
                </CompetitionProvider>
              </TalentProvider>
            </AuthProvider>
          </AlertProvider>
        </AccentColorProvider> 
      </ThemeProvider>
    </HashRouter>
  // </React.StrictMode> // Removed StrictMode
);