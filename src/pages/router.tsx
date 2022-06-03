import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../config/auth';

import Login from './login';
import Dashboard from './dashboard';
import { useEffect, useState } from 'react';

export default function Router() {
  const { loggedIn, isAuthenticated } = useAuth();
  const [ sameSession, setSameSession ] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const authed = await isAuthenticated();
      if (!loggedIn && !sameSession) {
        setSameSession(authed);
      }
    }
    checkSession()
  }, [isAuthenticated, loggedIn, sameSession])

  function ProtectedRoute() {
    return (loggedIn || sameSession)?<Outlet />:<Navigate to='/login' replace />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoute/>}>
          <Route path='/' element={<Navigate to='/dashboard' replace/>}/>
          <Route path='/dashboard' element={<Dashboard />}/>
        </Route>
        <Route path='/login' element={(loggedIn || sameSession)?<Navigate to='/' replace />:<Login />}/>
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}