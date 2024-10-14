import {Routes, Route} from 'react-router-dom';
import './scripts/i18n';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { UserData } from './scripts/types';


interface AppProps {
  userData: UserData | null; // Импортируйте UserData, если необходимо
}
const App: React.FC<AppProps> = ({ userData }) =>  {
  console.log(userData)
  return (
    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
