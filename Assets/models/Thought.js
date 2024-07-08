const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction")
const mongoose = require('mongoose');


const thoughtSchema = new Schema(
  {
      thoughtText: {
          type: String,
          required: true,
          minlength: 1,
          maxlength: 280
      },
      createdAt: {
          type: Date,
          default: Date.now,
          get: (date) => {
              if (date) {
                  return date.toLocaleDateString();
              }
          }
      },
      username: {
          type: String,
          required: true
      },
      reactions: [reactionSchema]
  },
  {
      toJSON: {
          virtuals: true
      },
      id: false
  }
);

thoughtSchema.virtual("reactionCount")
  .get(function() {
      return this.reactions.length;
  });

const Thought = mongoose.model("thought", thoughtSchema);

module.exports = Thought;