import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import TripCard from '../components/TripCard.jsx';
import TripForm from '../components/TripForm.jsx';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formMode, setFormMode] = useState(null); // null | 'create' | 'edit'
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  const fetchTrips = useCallback(async () => {
    try {
      const res = await api.get('/trips');
      setTrips(res.data);
      setError('');
    } catch (err) {
      if (err.response?.status === 401) {
        handleLogout(); // token expired
        return;
      }
      setError(err.response?.data?.message || 'Could not load your trips. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  const openCreate = () => {
    setSelectedTrip(null);
    setFormError('');
    setFormMode('create');
  };

  const openEdit = (trip) => {
    setSelectedTrip(trip);
    setFormError('');
    setFormMode('edit');
  };

  const closeForm = () => {
    setFormMode(null);
    setSelectedTrip(null);
    setFormError('');
  };

  const handleSave = async (data) => {
    setSaving(true);
    setFormError('');
    try {
      if (formMode === 'edit') {
        await api.put(`/trips/${selectedTrip._id}`, data);
      } else {
        await api.post('/trips', data);
      }
      await fetchTrips(); // refresh the list
      closeForm();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not save the trip. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (trip) => {
    if (!window.confirm(`Delete "${trip.title}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/trips/${trip._id}`);
      await fetchTrips(); // refresh the list
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete the trip. Please try again.');
    }
  };

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div>
          <h1>Welcome, {user?.name} 👋</h1>
          <p className="muted">{user?.email}</p>
        </div>
        <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
      </header>

      {formMode ? (
        <TripForm
          key={selectedTrip?._id || 'new'}
          initialData={formMode === 'edit' ? selectedTrip : null}
          onSubmit={handleSave}
          onCancel={closeForm}
          submitting={saving}
          error={formError}
        />
      ) : (
        <section>
          <div className="section-head">
            <h2>My trips</h2>
            <button className="btn" onClick={openCreate}>Create trip</button>
          </div>

          {error && <p className="error">{error}</p>}

          {loading ? (
            <p className="muted">Loading your trips...</p>
          ) : trips.length === 0 ? (
            <div className="empty-state">
              <h3>No trips yet</h3>
              <p>Your travel memories will live here. Add your first trip to get started.</p>
              <button className="btn" onClick={openCreate}>Add your first trip</button>
            </div>
          ) : (
            <div className="trip-grid">
              {trips.map((trip) => (
                <TripCard key={trip._id} trip={trip} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
