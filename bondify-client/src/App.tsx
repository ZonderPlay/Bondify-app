import {Routes, Route} from 'react-router-dom';
import './scripts/i18n';
import { HomePage } from './pages/home';
import { LoginAppPage } from './pages/login_app';
function App() {

  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login-app" element={<LoginAppPage />} />
    </Routes>
  )
}

export default App
