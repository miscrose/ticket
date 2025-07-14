

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Calendrier from './pages/Calendrier';



function App() {
  

  return (
    
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="calendrier" element={<Calendrier />} />
           
          </Route>
   
        </Routes>
      </Router>
    
  )
}

export default App
