// timeZone UTC so the date shown is the date that was saved
const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });

function dateText(trip) {
  if (trip.startDate && trip.endDate) return `${formatDate(trip.startDate)} to ${formatDate(trip.endDate)}`;
  if (trip.startDate) return `From ${formatDate(trip.startDate)}`;
  if (trip.endDate) return `Until ${formatDate(trip.endDate)}`;
  return 'Dates not added';
}

export default function TripCard({ trip, onEdit, onDelete }) {
  return (
    <article className="trip-card" onClick={() => onEdit(trip)}>
      <h3>{trip.title}</h3>
      <p className="trip-destination">{trip.destination}</p>
      <p className="trip-dates">{dateText(trip)}</p>

      {trip.rating ? (
        <p className="stars" aria-label={`Rated ${trip.rating} out of 5`}>
          {'★'.repeat(trip.rating)}
          {'☆'.repeat(5 - trip.rating)}
        </p>
      ) : (
        <p className="trip-dates">Not rated yet</p>
      )}

      <div className="trip-actions">
        <button
          className="btn btn-small btn-outline"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(trip);
          }}
        >
          Edit
        </button>
        <button
          className="btn btn-small btn-danger"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(trip);
          }}
        >
          Delete
        </button>
      </div>
    </article>
  );
}
