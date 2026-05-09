import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Handles the Google OAuth redirect from backend.
 * URL pattern: /auth/google/success?data=<encoded_user_json>
 * 
 * The backend sends: { _id, name, email, role, avatar, token }
 * We store it in localStorage then reload the app context.
 */
const GoogleSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { fetchData } = useAuth();

  useEffect(() => {
    const raw = searchParams.get('data');
    const error = searchParams.get('error');

    if (error || !raw) {
      navigate('/login?error=google_failed');
      return;
    }

    try {
      const userData = JSON.parse(decodeURIComponent(raw));
      // Normalize _id to id for frontend consistency
      if (userData._id && !userData.id) userData.id = String(userData._id);

      // Store session (same format regular login uses)
      localStorage.setItem('cookme_user', JSON.stringify(userData));

      // Reload context data then go home
      fetchData().then(() => {
        navigate('/', { replace: true });
      });
    } catch (err) {
      console.error('Google login parse error:', err);
      navigate('/login?error=parse_failed');
    }
  }, []); // eslint-disable-line

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', gap: 16, fontFamily: 'sans-serif',
      background: '#fdf5f0',
    }}>
      <div style={{ fontSize: 48, animation: 'spin 1s linear infinite' }}>🔄</div>
      <p style={{ color: '#8b7355', fontSize: 16, fontWeight: 500 }}>
        Signing you in with Google…
      </p>
    </div>
  );
};

export default GoogleSuccess;
