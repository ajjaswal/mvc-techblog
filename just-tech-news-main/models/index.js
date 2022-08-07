// An index file to gather the models and export them for use

// User model
const User = require('./User');
// Post model
const Post = require('./Post');
// Vote model
const Vote = require('./Vote');
// Comment model
const Comment = require('./Comment');

// Create associations between the models
// User-Post relationship
User.hasMany(Post, {
    foreignKey: 'user_id'
});
//Post-User relationship
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

// User-Vote-Post through relationship
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

// Post-Vote-User through relationship
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

// Vote-User relationship
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

// Vote-Post relationship
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

// User-Vote relationship
User.hasMany(Vote, {
    foreignKey: 'user_id'
});

// Post-Vote relationship
Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

// Comment-User relationship
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

// Comment-Post relationship
Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

// User-Comment relationsihp
User.hasMany(Comment, {
    foreignKey: 'user_id'
});

// Post-Comment relationship
Post.hasMany(Comment, {
    foreignKey: 'post_id'
})

// Export the modules
module.exports = { User, Post, Vote, Comment };