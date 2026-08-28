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
import BoardReview from './pages/BoardReview';
import NewMuslims from './pages/NewMuslims';
import ChastityLibrary from './pages/ChastityLibrary';
import About from './pages/About';
import Support from './pages/Support';
import NotFound from './pages/NotFound';

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
              <Route path="/board" element={<BoardReview />} />
              <Route path="/new-muslims" element={<NewMuslims />} />
              <Route path="/chastity-library" element={<ChastityLibrary />} />
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<Support />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Signature />
          <Footer />
        </div>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
