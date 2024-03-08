const mongoose = require('mongoose');
const fs = require('fs');
const Post = require('../../models/Post'); // Import your Mongoose model

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mern', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;

// Read the JSON file
const jsonData = fs.readFileSync(__dirname + '/posts.json');
const posts = JSON.parse(jsonData);

// Function to import posts
async function importPosts() {
    try {
        // Iterate through the array of post objects
        for (const postData of posts) {
            
            // Create a new Mongoose model instance for each post object
            const post = new Post(postData);
            // Save the model instance to MongoDB
            await post.save();
        }
    
    } catch (error) {
        console.error('Error importing posts:', error);
    } finally {
        // Close the connection to the database
        db.close();
    }
}

// Call the importPosts function to start the import process
importPosts();
