import { useState } from 'react'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import {AuthProvider} from './context/AuthContext'


function App() {

  return (
    <>
        <BrowserRouter>
          <AuthProvider> {/*we are going to wrap the Routes with the AuthProvider component, the components wrapped can use what the provider shares*/}
            <Routes>
              <Route 
                path="/" 
                element={
                  <ProtectedRoute> {/*we are going to wrap the Home component with the ProtectedRoute component*/}
                    <HomePage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/login" element={<LoginPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
    </>
  )
}

export default App
