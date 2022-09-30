const mongoose = require('mongoose');
const slugify = require('slugify');
const { slugToArabic } = require('./../controllers/globalFactory');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us championship name!'],
      unique: true,
      trim: true
    },
    slug: String,
    date: {
      type: Date,
      required: [true, 'Please tell us championship date!']
    },
    activity: {
      type: mongoose.Schema.ObjectId,
      ref: 'Activity',
      required: [true, 'Championship must belong to an activity']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

schema.pre('save', function(next) {
  const arabic = /[\u0600-\u06FF]/;
  if (arabic.test(this.name)) {
    this.slug = slugToArabic(this.name);
  } else {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

schema.pre(/^find/, function(next) {
  this.populate({
    path: 'activity',
    select: 'name image'
  });
  next();
});

const Championship = mongoose.model('Championship', schema);

module.exports = Championship;
