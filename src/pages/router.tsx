import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../config/auth';

import Login from './login';
import Dashboard from './dashboard';
import { useEffect, useState } from 'react';
import { Profile } from './profile';

let savedPath = '/dashboard';
const setPath = (path: string) => {
  savedPath = path;
}

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
  }, [useAuth, sameSession])

  function ProtectedRoute() {
    const path = useLocation().pathname;
    if (path !== '/login' && path !== '/') setPath(path)
    // console.log(savedPath)
    return (loggedIn || sameSession)?<Outlet />:<Navigate to='/login' replace />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoute/>}>
          <Route path='/' element={<Navigate to='/dashboard' replace/>}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/profile' element={<Profile />}/>
        </Route>
        <Route path='/login' element={(loggedIn || sameSession)?<Navigate to={savedPath} replace />:<Login />}/>
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}