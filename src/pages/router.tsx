import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '../config/auth';

import Login from './login';
import Dashboard from './dashboard';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<ProtectedRoute/>}>
          <Route path='/' element={<Navigate to='/dashboard' replace/>}/>
          <Route path='/dashboard' element={<Dashboard />}/>
        </Route>
        <Route path='/login' element={(useAuth().loggedIn)?<Navigate to='/' replace />:<Login />}/>
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export function ProtectedRoute() {
  return (useAuth().loggedIn)?<Outlet />:<Navigate to='/login' replace />;
}