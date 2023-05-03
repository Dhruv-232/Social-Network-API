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
    User.findOne({ _id: req.params.Id })
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

  // Add an assignment to a student
  addAssignment(req, res) {
  console.log('You are adding an assignment');
  console.log(req.body);
  Student.findOneAndUpdate(
    { _id: req.params.studentId },
    { $addToSet: { assignments: req.body } },
    { runValidators: true, new: true }
  )
    .then((student) =>
      !student
        ? res
          .status(404)
          .json({ message: 'No student found with that ID :(' })
        : res.json(student)
    )
    .catch((err) => res.status(500).json(err));
},
// Remove assignment from a student
removeAssignment(req, res) {
  Student.findOneAndUpdate(
    { _id: req.params.studentId },
    { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
    { runValidators: true, new: true }
  )
    .then((student) =>
      !student
        ? res
          .status(404)
          .json({ message: 'No student found with that ID :(' })
        : res.json(student)
    )
    .catch((err) => res.status(500).json(err));
},
};
