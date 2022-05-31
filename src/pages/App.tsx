import { AuthProvider } from '../config/auth';
import Router from './router';

function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}

export default App;
