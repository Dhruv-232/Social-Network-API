const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then((users) => {
        res.json(users);
      }

      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    console.log("ID = ", req.params.id);
    console.log("Req.params = ", req.params);
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('friends')
      .populate('thoughts')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json({
            user
          })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a student and remove them from the course
  async deleteUser(req, res) {
    try {
      const userData = await User.findOneAndDelete({ _id: req.params.userId })

      if (!userData) {
        return res.status(404).json({ message: 'No user with this id!' });
      }

      await Thought.deleteMany({ _id: { $in: userData.thoughts } });
      res.json({ message: 'User and their thoughts deleted!' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }

},

async updateUser(req, res) {
  try {
    const userData = await User.findOneAndUpdate(
      { _id: req.params.userId },
      {
        $set: req.body,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    if (!userData) {
      return res.status(404).json({ message: 'No user with that id!' });
    }

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
},

// Create friend
async createFriend(req, res) {
  try {
    const userData = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true });

    if (!userData) {
      return res.status(404).json({ message: 'No user with that id!' });
    }

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
},

// Remove friend from a user
async removeFriend(req, res) {
  try {
    const userData = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true });

    if (!userData) {
      return res.status(404).json({ message: 'No user with that id!' });
    }

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
},
};
