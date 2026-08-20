import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Signature from './components/Signature';
import ErrorBoundary from './components/ErrorBoundary';
import OilGrainFilter from './components/OilGrainFilter';
import { LanguageProvider } from './context/LanguageContext';
import Home from './pages/Home';
import Aqeedah from './pages/Aqeedah';
import Majalis from './pages/Majalis';
import Zawaj from './pages/Zawaj';
import Dawah from './pages/Dawah';
import Join from './pages/Join';
import Privacy from './pages/Privacy';

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <OilGrainFilter />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/aqeedah" element={<Aqeedah />} />
              <Route path="/majalis" element={<Majalis />} />
              <Route path="/zawaj" element={<Zawaj />} />
              <Route path="/dawah" element={<Dawah />} />
              <Route path="/join" element={<Join />} />
              <Route path="/privacy" element={<Privacy />} />
            </Routes>
          </main>
          <Signature />
          <Footer />
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
