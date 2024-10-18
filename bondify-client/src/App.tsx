import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} /> {/* Не передаем userData, так как он доступен из контекста */}
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
