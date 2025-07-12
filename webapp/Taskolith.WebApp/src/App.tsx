import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

function App() {
  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/*other routes*/}
      </Routes>
  )
}

export default App
