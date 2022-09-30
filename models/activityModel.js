const mongoose = require('mongoose');
const slugify = require('slugify');
const { slugToArabic } = require('./../controllers/globalFactory');

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An activity must have a name'],
      unique: true,
      trim: true
    },
    slug: String,
    image: {
      type: String,
      required: [true, 'An activity must have an image']
    },
    imageCover: {
      type: String,
      required: [true, 'An activity must have an image cover']
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: true
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

schema.virtual('coaches', {
  ref: 'Coach',
  foreignField: 'activities',
  localField: '_id'
});

schema.virtual('moderators', {
  ref: 'Moderator',
  foreignField: 'activities',
  localField: '_id'
});

schema.virtual('belts', {
  ref: 'Belt',
  foreignField: 'activities',
  localField: '_id'
});

// schema.pre(/^find/, function() {
// this.populate('coaches');
//   // .populate({
//   //   path: 'moderators',
//   //   select: 'name image'
//   // })
//   // .populate({
//   //   path: 'belts',
//   //   select: 'name image'
//   // });
// });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
schema.pre('save', function(next) {
  const arabic = /[\u0600-\u06FF]/;
  if (arabic.test(this.name)) {
    this.slug = slugToArabic(this.name);
  } else {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

schema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Activity = mongoose.model('Activity', schema);

module.exports = Activity;
