const { User, Thought, Reaction } = require("../models/Index");

module.exports = {
  getThoughts(req, res) {
    Thought.find()
        .then(thoughts => res.status(200).json(thoughts))
        .catch(err => res.status(500).json(err));
},

getSingleThought(req, res) {
  Thought.findById(req.params.thoughtId)
      .then(thought => thought ? res.status(200).json(thought) : res.status(404).json({ message: "No thought found with that id!" }))
      .catch(err => res.status(500).json(err));
},

createThought(req, res) {
  if (req.body.thoughtText && req.body.username && req.body.userId) {
      Thought.create(req.body)
          .then(thought => {
              return User.findByIdAndUpdate(
                  req.body.userId,
                  { $addToSet: { thoughts: thought._id } },
                  { runValidators: true, new: true }
              )
          })
          .then(user => user ? res.status(200).json(user) : res.status(404).json({ message: "No user found with this id!" }))
          .catch(err => res.status(500).json(err));
  }
  else {
      res.status(404).json({ message: "Request body must contain thoughtText, username and userId" });
  }
},

updateThought(req, res) {
  Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $set: req.body },
      { runValidators: true, new: true }
  )
      .then(thought => thought ? res.status(200).json(thought) : res.status(404).json({ message: "No thought found with that id!" }))
      .catch(err => res.status(500).json(err));
},

deleteThought(req, res) {
  Thought.findByIdAndDelete(req.params.thoughtId)
      .then(thought => thought ? User.findOneAndUpdate(
          { thoughts: req.params.thoughtId },
          { $pull: { thoughts: req.params.thoughtId } },
          { new: true }
      ) : res.status(404).json({ message: "No thought found with that id!" }))
      .then(user => user ? res.status(200).json({ message: "Thought deleted!" }) : res.status(404).json({ message: "Thought deleted but no associated user found!" }))
      .catch(err => res.status(500).json(err));
},

createReaction(req, res) {
  if (req.body.reactionBody && req.body.username) {
      Thought.findByIdAndUpdate(
          req.params.thoughtId,
          { $push: { reactions: { ...req.body }} },
          {runValidators: true, new: true }
      )
      .then(thought => thought ? res.status(200).json(thought) : res.status(404).json({ message: "No thought found with that id!" }))
      .catch(err => res.status(500).json(err));
  }
  else {
      res.status(404).json({ message: "Request body must contain reactionBody and username" });
  }
},

deleteReaction(req, res) {
  Thought.findByIdAndUpdate(
      req.params.thoughtId,
      { $pull: { reactions: {reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
  )
  .then(thought => thought ? res.status(200).json(thought) : res.status(404).json({ message: "No thought found with that id!" }))
  .catch(err => res.status(500).json(err));
}
};
