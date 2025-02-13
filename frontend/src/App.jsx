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
import RegisterPage from './pages/RegisterPage'
import UploadFilePage from './pages/UploadFilePage'
import UpdateFilePage from './pages/UpdateFilePage'
import BookSessionPage from './pages/BookSessionPage'
import StudioPage from './pages/StudioPage'


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
                  path="/upload" 
                  element={
                      <ProtectedRoute>
                          <UploadFilePage />
                      </ProtectedRoute>
                  }
              />
              <Route
                path="/update-file/:id"
                element={
                  <ProtectedRoute>
                    <UpdateFilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book"
                element={
                  <ProtectedRoute>
                    <BookSessionPage />
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
              <Route path="/register" element={<RegisterPage />} />
              <Route path='/studio' element={<StudioPage />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
    </>
  )
}

export default App
