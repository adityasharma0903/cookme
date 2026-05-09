import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API, { uploadImage } from '../../api';
import './EditProfile.css';

const EditProfile = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [username, setUsername] = useState('');
  const [instagram, setInstagram] = useState('');
  const [youtube, setYoutube] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | undefined>(undefined);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setUsername((user as any).username || '');
      setBio((user as any).bio || '');
      setInstagram((user as any).socialLinks?.instagram || '');
      setYoutube((user as any).socialLinks?.youtube || '');
      setPreview(user.avatar || undefined);
    }
  }, [user]);

  useEffect(() => {
    if (!avatarFile) return;
    const url = URL.createObjectURL(avatarFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (f) setAvatarFile(f);
  };

  const handleSave = async () => {
    setError('');
    if (!user) return;
    setIsSaving(true);
    try {
      let avatarUrl = undefined;
      if (avatarFile) {
        avatarUrl = await uploadImage(avatarFile);
      }
      const payload: any = {
        name, bio, username,
        socialLinks: { instagram: instagram || undefined, youtube: youtube || undefined },
      };
      if (avatarUrl) payload.avatar = avatarUrl;
      await updateProfile(payload);
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card">
        <h2>Edit Profile</h2>
        {error && <div className="edit-error">{error}</div>}

        <div className="edit-avatar-row">
          <div className="edit-avatar-preview">
            <img src={preview || '/placeholder-avatar.png'} alt="avatar" />
          </div>
          <div>
            <label className="btn">Choose Photo
              <input type="file" accept="image/*" onChange={handleFile} hidden />
            </label>
            <p className="muted">Recommended: 400x400px</p>
          </div>
        </div>

        <div className="edit-field">
          <label>Full name</label>
          <input value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div className="edit-field">
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} />
        </div>

        <div className="edit-field">
          <label>Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} />
        </div>

        <div className="edit-field">
          <label>Instagram URL</label>
          <input value={instagram} onChange={e => setInstagram(e.target.value)} placeholder="https://instagram.com/yourhandle" />
        </div>

        <div className="edit-field">
          <label>YouTube URL</label>
          <input value={youtube} onChange={e => setYoutube(e.target.value)} placeholder="https://youtube.com/channel/.." />
        </div>

        <div className="edit-actions">
          <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
