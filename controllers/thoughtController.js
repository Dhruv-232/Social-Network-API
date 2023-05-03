const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

module.exports = {
    // Get all thoughts
    getThoughts(req, res) {
      Thought.find()
        .then((thoughts) => {
          res.json(thoughts);
        }
  
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },
};