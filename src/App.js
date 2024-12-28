import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MetadataProvider } from './hooks/MetadataContext';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <MetadataProvider>
      <HelmetProvider>
          <ThemeProvider>
            <StyledChart />
            <Router />
          </ThemeProvider>
      </HelmetProvider>
    </MetadataProvider>
  );
}
