import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HealthProvider } from './context/HealthContext.jsx';
import { MainLayout } from './layouts/MainLayout.jsx';
import { HomePage } from './pages/HomePage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

function App() {
  return (
    <HealthProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </HealthProvider>
  );
}

export default App;

