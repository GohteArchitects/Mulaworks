import Admin from '../../components/admin/admin';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <div style={{ marginTop: '8rem' }} /> {/* Top spacer */}
      <Admin />
      <div style={{ marginBottom: '8rem' }} /> {/* Bottom spacer */}
    </ProtectedRoute>
  );
}