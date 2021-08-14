import { HashRouter as Router } from 'react-router-dom';
import { Container } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';

import { Header } from './shared/Header';
import { Routes } from './Routes';
import { Features } from './shared/Features';
import { Attribution } from './shared/Attribution';
import { theme } from './theme';
import { AuthProvider } from 'oidc-react';
import { oidcConfig } from './oidc-config';

if (process.env.NODE_ENV !== 'production') {
  console.log('App!');
}

const App = () => {
  // TODO: Removed in future version.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister();
      }
    });
  }

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <AuthProvider {...oidcConfig}>
          <Header />
          <Container maxWidth={'lg'}>
            <Routes />
            <Features />
            <Attribution />
          </Container>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
