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
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.Id })
          .then(async (thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with that ID' })
              : res.json({
                thought
              })
          )
          .catch((err) => {
            console.log(err);
            return res.status(500).json(err);
          });
      },

      createThought(req, res) {
        Thought.create(req.body)
          .then((thought) => {
            User.findOneAndUpdate(
                {_id:req.body.userId},
                {$push: {thoughts: thought._id}},
                {new: true}
            )
            .then((user) =>{
                if(!user) {
                    return
                    res.status(404).json({ message: 'Thought created but no user with that id!' });
                }
                res.json({ message: 'Thought  created!' });

          })
          .catch((err) => res.status(500).json(err));
          })
          .catch((err) => res.status(500).json(err));
      },
};