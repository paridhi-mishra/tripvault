const express = require('express');
const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Every trip route needs a valid token
router.use(authMiddleware);

// Only these fields can be set from the request body
const ALLOWED_FIELDS = ['title', 'destination', 'startDate', 'endDate', 'description', 'rating'];

function cleanBody(body) {
  const data = {};
  ALLOWED_FIELDS.forEach((field) => {
    if (body[field] !== undefined) data[field] = body[field];
  });

  // Empty form values mean "no value"
  ['startDate', 'endDate', 'rating'].forEach((field) => {
    if (data[field] === '') data[field] = null;
  });

  return data;
}

function datesAreValid(startDate, endDate) {
  if (!startDate || !endDate) return true;
  return new Date(endDate) >= new Date(startDate);
}

function sendError(res, err) {
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)[0].message;
    return res.status(400).json({ message });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ message: `Invalid value for ${err.path}` });
  }
  console.error(err);
  return res.status(500).json({ message: 'Server error' });
}

// Finds a trip and makes sure it belongs to the logged-in user.
// Sends the error response itself and returns null if something is wrong.
async function findOwnedTrip(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).json({ message: 'Invalid trip id' });
    return null;
  }

  const trip = await Trip.findById(req.params.id);
  if (!trip) {
    res.status(404).json({ message: 'Trip not found' });
    return null;
  }

  if (trip.user.toString() !== req.user.id) {
    res.status(403).json({ message: 'You are not allowed to access this trip' });
    return null;
  }

  return trip;
}

// POST /api/trips - create a trip
router.post('/', async (req, res) => {
  try {
    const data = cleanBody(req.body);

    if (!data.title || !String(data.title).trim() || !data.destination || !String(data.destination).trim()) {
      return res.status(400).json({ message: 'Title and destination are required' });
    }
    if (!datesAreValid(data.startDate, data.endDate)) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    const trip = await Trip.create({ ...data, user: req.user.id });
    res.status(201).json(trip);
  } catch (err) {
    sendError(res, err);
  }
});

// GET /api/trips - all trips of the logged-in user only
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    sendError(res, err);
  }
});

// GET /api/trips/:id - one trip (owner only)
router.get('/:id', async (req, res) => {
  try {
    const trip = await findOwnedTrip(req, res);
    if (!trip) return;
    res.json(trip);
  } catch (err) {
    sendError(res, err);
  }
});

// PUT /api/trips/:id - update a trip (owner only)
router.put('/:id', async (req, res) => {
  try {
    const trip = await findOwnedTrip(req, res);
    if (!trip) return;

    trip.set(cleanBody(req.body));

    if (!datesAreValid(trip.startDate, trip.endDate)) {
      return res.status(400).json({ message: 'End date cannot be before start date' });
    }

    await trip.save(); // runs the schema validation again
    res.json(trip);
  } catch (err) {
    sendError(res, err);
  }
});

// DELETE /api/trips/:id - delete a trip (owner only)
router.delete('/:id', async (req, res) => {
  try {
    const trip = await findOwnedTrip(req, res);
    if (!trip) return;

    await trip.deleteOne();
    res.json({ message: 'Trip deleted successfully' });
  } catch (err) {
    sendError(res, err);
  }
});

module.exports = router;
