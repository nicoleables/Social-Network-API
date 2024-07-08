const { Thought, User } = require("../models/Index");

module.exports = {
  getUsers(req, res) {
    User.find()
        .then(users => res.status(200).json(users))
        .catch(err => res.status(500).json(err));
  },

createUser(req, res) {
    if (req.body.username && req.body.password) {
        User.create(req.body)
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json(err));
    }
    else {
        res.status(404).json("Request body must contain username and password");
    }
},

getSingleUser(req, res) {
    User.findById(req.params.userId)
        .then(user => user ? res.status(200).json(user) : res.status(404).json({ message: "No user found with this id" }))
        .catch(err => res.status(500).json(err));
},

updateUser(req, res) {
    User.findByIdAndUpdate(
        req.params.userId,
        { $set: req.body },
        { runValidators: true, new: true }
    )
    .then(user => user ? res.status(200).json(user) : res.status(404).json({ message: "No user found with this id!" }))
    .catch(err => res.status(500).json(err));
},

deleteUser(req, res) {
    User.findByIdAndDelete(req.params.userId)
        .then(user => 
            user ? Thought.deleteMany({ _id: { $in: user.thoughts } }) : res.status(404).json({ message: "No user found with this id!" })
        )
        .then(() => res.status(200).json({ message: "User and associated thoughts deleted!" }))
        .catch(err => res.status(500).json(err));
},

addFriend(req, res) {
    User.findByIdAndUpdate(
        req.params.userId,
        { $addToSet: { friends: req.params.friendId } },
        { runValidators: true, new: true }
    )
    .then(user => user ? res.status(200).json(user) : res.status(404).json({ message: "No user found with this id!" }))
    .catch(err => res.status(500).json(err));
},

deleteFriend(req, res) {
    User.findByIdAndUpdate(
        req.params.userId,
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
    )
    .then(user => user ? res.status(200).json(user) : res.status(404).json({ message: "No user found with this id!" }))
    .catch(err => res.status(500).json(err));
  }
};
    
