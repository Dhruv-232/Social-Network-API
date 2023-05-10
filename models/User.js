const { Schema, model } = require('mongoose');

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      max_length: 50,
      unique:true,
      trim:true,
    },
    email: {
      type: String,
      required: true,
      max_length: 50,
      unique:true,
      trim:true,
      match: [/.+@.+\..+/, 'Must match an email address!'],
    },
    github: {
      type: String,
      required: true,
      max_length: 50,
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Thought",
        },
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema.virtual("friendCount").get(function() {
    return this.friends.length;
})

const User = model('User', userSchema);

module.exports = User;
