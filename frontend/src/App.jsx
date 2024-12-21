import { useState } from 'react'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import {AuthProvider} from './context/AuthContext'
import SessionDetail from './components/SessionDetail'
import CalendarPage from './pages/CalendarPage'
import SessionPage from './pages/SessionPage'
import AudioFilesPage from './pages/AudioFilesPage'


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
              <Route 
                path="/sessions" 
                element={
                  <ProtectedRoute>
                    <SessionPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/sessionDetail/:id" 
                element={
                  <ProtectedRoute>
                    <SessionDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/calendar" 
                element={
                  <ProtectedRoute>
                    <CalendarPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/audio-files" 
                element={
                  <ProtectedRoute>
                    <AudioFilesPage />
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
