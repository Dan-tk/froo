import './App.css';
import './index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './pages/Home';
import ProfilePage from './pages/ProfilePage';
import All from './pages/All';
import Labels from './pages/Labels';
import Create from './pages/Create';
import Notification from './pages/NotificationPage';
import EditTask from './pages/EditTask';
import { RootState } from './app/store/store';
import { useEffect } from 'react';
import { checkAuthenticationStatus, initializeAuth } from './app/store/slices/authSlice';



function App() {
  const isAuthenticated = useSelector((state: RootState)=> state.auth.isAuthenticated);
  const dispatch = useDispatch();
 
  useEffect(() => {
    const authenticated = checkAuthenticationStatus();
    if (authenticated) {
      // Dispatch action to set authenticated state in Redux store
      // Example: dispatch(setAuthenticated());
      dispatch(initializeAuth())
    }
  }, [dispatch, isAuthenticated]);
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes accessible to all */}
        <Route path='/signin' element={<Login />} />
        <Route path='/signup' element={<Register />} />

        {/* Protected routes */}
        <Route path='/' element={isAuthenticated ? <Home /> : <Navigate to="/signin" />} />
        <Route path='/profile' element={isAuthenticated ? <ProfilePage /> : <Navigate to="/signin" />} />
        <Route path='/all' element={isAuthenticated ? <All /> : <Navigate to="/signin" />} />
        <Route path='/labels' element={isAuthenticated ? <Labels /> : <Navigate to="/signin" />} />
        <Route path='/create' element={isAuthenticated ? <Create /> : <Navigate to="/signin" />} />
        <Route path='/notifications' element={isAuthenticated ? <Notification /> : <Navigate to="/signin" />} />
        <Route path='/edit/:taskId' element={isAuthenticated ? <EditTask /> : <Navigate to="/signin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
