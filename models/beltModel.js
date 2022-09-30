const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const { slugToArabic } = require('./../controllers/globalFactory');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us belt name!']
    },
    slug: String,
    color: {
      type: String,
      required: [true, 'Please tell us color of belt!'],
      validate: [validator.isAlpha, 'Color must in english and one word']
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
        required: [true, 'Belt must belong to an activity']
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

const Belt = mongoose.model('Belt', schema);

module.exports = Belt;
