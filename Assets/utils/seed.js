const mongoose = require('mongoose');
const User = require('../models/User.js');
const Thought = require('../models/Thought.js');
const Reaction = require('../models/Reaction.js');

mongoose
  .connect("mongodb://localhost:27017/socialmediaDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    seedData();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const initialUser = [
    {
      username: 'alice',
      email: 'alice@example.com',
      thoughts: [],
      friends: [],
    },
    {
      username: 'bob',
      email: 'bob@example.com',
      thoughts: [],
      friends: [],
    },
  ];

  const initialThought = [
    {
      thoughtText: 'Express.js is awesome!',
      username: 'alice',
      reactions: [],
    },
    {
      thoughtText: 'Handlebars makes templating easy.',
      username: 'bob',
      reactions: [],
    },
  ];

  const initialReactions = [
    {
      reactionBody: 'I like it',
      username: 'alice',
      createdAt: new Date()
    },
    {
      reactionBody: 'that is nice',
      username: 'bob',
      createdAt: new Date()
    }
  ];

  async function seedData() {
    try {
      await User.deleteMany({});
      await Thought.deleteMany({});
  
      const createdUsers = await User.insertMany(initialUser);
      console.log("Users seeded:", createdUsers);
      
      const createdThoughts = [];
      for (const thoughtData of initialThought) {
        const thought = await Thought.create(thoughtData);
        createdThoughts.push(thought);
        const user = await User.findOne({ username: thought.username });
        user.thoughts.push(thought._id);
        await user.save();
        console.log("Thought seeded:", thought);
      }
  
  
      for (const reactionData of initialReactions) {
        const thought = createdThoughts[Math.floor(Math.random() * createdThoughts.length)];
        thought.reactions.push(reactionData);
        await thought.save();
        console.log("Reaction seeded:", reactionData);
      }
  
      const alice = await User.findOne({ username: "alice" });
      const bob = await User.findOne({ username: "bob" });
  
      alice.friends.push(bob._id);
      bob.friends.push(alice._id);
  
      await alice.save();
      await bob.save();
  
      console.log("Friends added:");
      console.log("alice friends:", alice.friends);
      console.log("bob friends:", bob.friends);
  
      console.log("Database seeding completed!");
      mongoose.connection.close();
    } catch (err) {
      console.error("Error seeding data:", err);
    }
  }