import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getUserProfile, updateUserProfile } from '../api/users';
import LoadingIndicator from '../components/LoadingIndicator';
import ErrorMessage from '../components/ErrorMessage';

const Profile = () => {
  const { updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile();
        setProfile(data.user);
        setName(data.user.name);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const data = await updateUserProfile({ name });
      setProfile(data.user);
      updateUser(data.user);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingIndicator />;

  if (!profile) {
    return (
      <div className="container">
        <ErrorMessage message={error || 'Profile not found'} />
      </div>
    );
  }

  return (
    <div className="container">
      <div className="profile-page">
        <h1>My Profile</h1>

        <div className="profile-info">
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
        </div>

        <form onSubmit={handleSubmit} className="form profile-form">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            id="name"
            type="text"
            className="form-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </form>

        <ErrorMessage message={error} />
        {success && <p className="success-message">{success}</p>}
      </div>
    </div>
  );
};

export default Profile;