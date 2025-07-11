

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import Dashboard from './pages/Dashboard'



function App() {
  

  return (
    
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/Dashboard" element={<Dashboard />} />
   
        </Routes>
      </Router>
    
  )
}

export default App
