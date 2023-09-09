const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: [true, 'First name is required'],
      text: true,
      max: 32,
    },

    last_name: {
      type: String,
      trim: true,
      required: [true, 'Last name is required'],
      text: true,
      max: 32,
    },

    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required'],
      text: true,
      unique: true,
    },

    email: {
      type: String,
      trim: true,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
    },

    picture: {
      type: String,
      default:
        'https://res.cloudinary.com/dmhcnhtng/image/upload/v1643044376/avatars/default_pic_jeaybr.png',
    },

    cover: {
      type: String,
      trim: true,
    },

    gender: {
      type: String,
      require: [true, 'Gender is required'],
    },

    role: {
      type: [String],
      default: ['Subscriber'],
      enum: ['Subscriber', 'Instructor', 'Admin'],
    },

    bYear: {
      type: Number,
      trim: true,
      required: [true, 'Birth year is required'],
    },

    bMonth: {
      type: Number,
      trim: true,
      required: [true, 'Birth month is required'],
    },

    bDay: {
      type: Number,
      trim: true,
      required: [true, 'Birth day is required'],
    },

    verified: {
      type: Boolean,
      default: false,
    },

    friends: {
      type: Array,
      default: [],
    },

    following: {
      type: Array,
      default: [],
    },

    followers: {
      type: Array,
      default: [],
    },

    requests: {
      type: Array,
      default: [],
    },

    search: [
      {
        user: {
          type: ObjectId,
          ref: 'User',
        },
      },
    ],

    details: {
      bio: {
        type: String,
      },

      otherName: {
        type: String,
      },

      job: {
        type: String,
      },

      workplace: {
        type: String,
      },

      highSchool: {
        type: String,
      },

      college: {
        type: String,
      },

      currentCity: {
        type: String,
      },

      hometown: {
        type: String,
      },

      relationship: {
        type: String,
        enum: [
          'Single',
          'In a relationship',
          'Engaged',
          'Married',
          'It is complicated',
          'In an open relationship',
          'Widowed',
          'Separated',
          'Divorced',
          'In a civil union',
          'In a domestic partnership',
        ],
      },

      instagram: {
        type: String,
      },

      currentCity: {
        type: String,
      },
    },

    savedPosts: [
      {
        post: {
          type: ObjectId,
          ref: 'Post',
        },
        savedAt: {
          type: Date,
          default: Date(),
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
