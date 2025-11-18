import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion';
import MainPage from './pages/MainPage';
import AuthPage from './pages/AuthPage';
import { UserPage } from './pages/UserPage';
import { AdminPage } from './pages/AdminPage';

const AppContent = () => {

  return (
    <>
      <AnimatePresence mode="wait">
        <div className="">
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </AnimatePresence>
    </>
  )
}

function App() {

  return (
    <>
      <Router>
        <AppContent />
      </Router>
    </>
  )
}

export default App
