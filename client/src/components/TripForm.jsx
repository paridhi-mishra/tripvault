import { useState } from 'react';

// "2026-10-07T00:00:00.000Z" -> "2026-10-07" (what <input type="date"> needs)
const toDateInput = (value) => (value ? String(value).slice(0, 10) : '');

export default function TripForm({ initialData, onSubmit, onCancel, submitting, error }) {
  const isEditing = Boolean(initialData);

  const [form, setForm] = useState({
    title: initialData?.title || '',
    destination: initialData?.destination || '',
    startDate: toDateInput(initialData?.startDate),
    endDate: toDateInput(initialData?.endDate),
    description: initialData?.description || '',
    rating: initialData?.rating ? String(initialData.rating) : '',
  });
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError('');

    if (form.startDate && form.endDate && form.endDate < form.startDate) {
      setLocalError('End date cannot be before start date.');
      return;
    }

    onSubmit({
      title: form.title,
      destination: form.destination,
      startDate: form.startDate || null,
      endDate: form.endDate || null,
      description: form.description,
      rating: form.rating ? Number(form.rating) : null,
    });
  };

  const shownError = localError || error;

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit trip' : 'Add a new trip'}</h2>
      {shownError && <p className="error">{shownError}</p>}

      <label>
        Title
        <input name="title" placeholder="Goa with friends" value={form.title} onChange={handleChange} required />
      </label>

      <label>
        Destination
        <input name="destination" placeholder="Goa, India" value={form.destination} onChange={handleChange} required />
      </label>

      <div className="row-2">
        <label>
          Start date
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} />
        </label>
        <label>
          End date
          <input name="endDate" type="date" value={form.endDate} onChange={handleChange} />
        </label>
      </div>

      <label>
        Rating
        <select name="rating" value={form.rating} onChange={handleChange}>
          <option value="">No rating yet</option>
          <option value="1">1 - Poor</option>
          <option value="2">2 - Fair</option>
          <option value="3">3 - Good</option>
          <option value="4">4 - Great</option>
          <option value="5">5 - Amazing</option>
        </select>
      </label>

      <label>
        Notes and memories
        <textarea name="description" rows={4} placeholder="What made this trip special?" value={form.description} onChange={handleChange} />
      </label>

      <div className="row">
        <button className="btn" disabled={submitting}>
          {submitting ? 'Saving...' : isEditing ? 'Save changes' : 'Create trip'}
        </button>
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}
