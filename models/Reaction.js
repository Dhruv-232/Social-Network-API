const { Schema, model } = require('mongoose');

// Schema to create a course model
const reactionSchema = new Schema(
  {
    reactionID: {
      type: Schema.Types.ObjectId,
      default: () => {new Types.ObjectId()}
    },

    reactionBody: {
        type: String,
        required: true,
        maxlength: 280,
      },
    
    createdAt: {
      type: Date,
      default: Date.now(),
    },

    username: {
        type: String,
        required: true,
      },
    
  },
  {
    toJSON: {

    },
    id: false,
  }
);

module.exports = reactionSchema;
