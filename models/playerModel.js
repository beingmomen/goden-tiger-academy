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
    startDate: {
      type: Date,
      required: [true, 'Please tell us start date!']
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: true
    },
    birth: {
      type: Date,
      required: [true, 'Please tell us your birthday!']
    },
    nationalId: {
      type: String,
      required: [true, 'Please tell us your national Id!']
    },
    lastBelt: {
      belt: {
        type: mongoose.Schema.ObjectId,
        ref: 'Belt',
        required: [true, 'Please tell us your last belt!']
      },
      date: {
        type: Date,
        required: [true, 'Please tell us your last belt!']
      }
    },
    championships: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Championship',
        required: [true, 'Player must belong to a championship']
      }
    ],
    activity: {
      type: mongoose.Schema.ObjectId,
      ref: 'Activity',
      required: [true, 'Player must belong to an activity']
    },
    belts: [
      {
        belt: {
          type: mongoose.Schema.ObjectId,
          ref: 'Belt',
          required: [true, 'Player must belong to a belts']
        },
        date: {
          type: Date,
          required: [true, 'Please tell us your last belt!']
        }
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
    path: 'activity',
    select: 'name image'
  })
    .populate({
      path: 'lastBelt.belt',
      select: 'name'
    })
    .populate({
      path: 'belts.belt',
      select: 'name color'
    });
  next();
});

const Player = mongoose.model('Player', schema);

module.exports = Player;
