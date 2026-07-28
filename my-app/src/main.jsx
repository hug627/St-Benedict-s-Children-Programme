import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CompanySite from './App.jsx'
import AuthPage from './AuthPage.jsx'
import ResetPassword from './ResetPassword.jsx'
import { AuthProvider } from './AuthContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<CompanySite />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
