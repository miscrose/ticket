

import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Calendrier from './pages/Calendrier';
import KanbanPage from './pages/Kanban';
import ProfilePage from './pages/Profile';


function App() {
  

  return (
    
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="calendrier" element={<Calendrier />} />
            <Route path="profil" element={<ProfilePage />} />
            <Route path="kanban" element={<KanbanPage />} />
          </Route>
   
        </Routes>
      </Router>
    
  )
}

export default App
