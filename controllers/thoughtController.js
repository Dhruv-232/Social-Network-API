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

      // delete thought
      async deleteThought(req, res) {
        try {
          const thought = await Thought.findOneAndRemove({ _id: req.params.thoughtId })
    
          if (!thought) {
            return res.status(404).json({ message: 'No thought with that id!' });
          }
    
          // remove thought id from user's `thoughts` field
          const user = User.findOneAndUpdate(
            { thoughts: req.params.thoughtId },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
          );
    
          if (!user) {
            return res.status(404).json({ message: 'Thought created but no user with that id!' });
          }
    
          res.json({ message: 'Thought deleted!' });
        } catch (err) {
          console.log(err);
          res.status(500).json(err);
        }
      },
        // update thought
        async updateThought(req, res) {
            const thought = await Thought.findOneAndUpdate({ _id: req.params.thoughtId }, { $set: req.body }, { runValidators: true, new: true });
        
            if (!thought) {
              return res.status(404).json({ message: 'No thought with that id!' });
            }
        
            res.json(thought);
        
            console.log(err);
            res.status(500).json(err);
          },
        
        // Add reaction
        async addReaction(req, res) {
            try {
              const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true }
              );
        
              if (!thought) {
                return res.status(404).json({ message: 'No thought with that id!' });
              }
        
              res.json(thought);
            } catch (err) {
              console.log(err);
              res.status(500).json(err);
            }
          },
        
        
};