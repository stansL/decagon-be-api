const express = require('express');


const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');
const TimelineEvent = require('../models/TimelineEvent');
const { getTimelines, addTimeline, getTimeline, updateTimeline, deleteTimeline } = require('../controllers/timelines');

router
  .route('/')
  .get(
    advancedResults(TimelineEvent, {
      path: 'member',
      select: 'name'
    }), getTimelines)
  .post(protect, authorize('welfare', 'finance', 'admin'), addTimeline);

router
  .route('/:id')
  .get(getTimeline)
  .put(protect, authorize('welfare', 'finance', 'admin'), updateTimeline)
  .delete(protect, authorize('welfare', 'finance', 'admin'), deleteTimeline);

module.exports = router;
