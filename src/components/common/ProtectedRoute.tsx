import { useState, ReactNode } from 'react';
import AdminLogin from './AdminLogin';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authed, setAuthed] = useState(
    sessionStorage.getItem('admin_authed') === 'true'
  );

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />;
  return children;
}
