const mongoose = require('mongoose');
const slugify = require('slugify');
const { slugToArabic } = require('./../controllers/globalFactory');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
      unique: true,
      trim: true
    },
    slug: String,
    image: {
      type: String,
      default: 'default.jpg'
    },
    courses: {
      type: [String],
      required: [true, 'Please tell us about your courses!']
    },
    startDate: {
      type: Date,
      required: [true, 'Please tell us start date!']
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: true
    },
    activities: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Activity',
        required: [true, 'Coach must belong to an activity']
      }
    ]
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
    path: 'activities',
    select: 'name image'
  });
  next();
});

const Coach = mongoose.model('Coach', schema);

module.exports = Coach;
