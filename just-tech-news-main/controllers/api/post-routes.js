// Dependencies
// Express.js connection
const router = require('express').Router();
// User model and Post model
const { User, Post, Vote, Comment } = require('../../models');
// Sequelize database connection
const sequelize = require('../../config/connection');
// the authorization middleware to redirect unauthenticated users to the login page
const withAuth = require('../../utils/auth');

// Routes

// GET api/posts/ -- get all posts
router.get('/', (req, res) => {
    Post.findAll({
        // Query configuration
        // From the Post table, include the post ID, URL, title, and the timestamp from post creation, as well as total votes
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
          ],
        // Order the posts from most recent to least
        order: [[ 'created_at', 'DESC']],
        // From the User table, include the post creator's user name
        // From the Comment table, include all comments
        include: [
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            }
        ]
    })
    // return the posts
    .then(dbPostData => res.json(dbPostData))
    // if there was a server error, return the error
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET api/posts/:id -- get a single post by id
router.get('/:id', (req, res) => {
    Post.findOne({
      where: {
        // specify the post id parameter in the query
        id: req.params.id
      },
      // Query configuration, as with the get all posts route
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: User,
          attributes: ['username']
        },
        {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
                model: User,
                attributes: ['username']
            }
        }
      ]
    })
      .then(dbPostData => {
        // if no post by that id exists, return an error
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        // if a server error occured, return an error
        console.log(err);
        res.status(500).json(err);
      });
  });

// POST api/posts -- create a new post
router.post('/', withAuth, (req, res) => {
    // expects object of the form {title: 'Sample Title Here', post_url: 'http://somestring.someotherstring', user_id: 1}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// PUT api/posts/upvote -- upvote a post (this route must be above the update route, otherwise express.js will treat upvote as an id)
router.put('/upvote', withAuth, (req, res) => {
  // make sure that a session exists, i.e. that a user is logged in
  if (req.session) {
    // pass the session user id along with the req.body properties (destructured) to the model method created in Post.js for upvotes
    Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
    // return the data (lines changed)
    .then(updatedVoteData => res.json(updatedVoteData))
    // or an error if one occurs
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
  }
  // if a user is not logged in, send a bad request error
  else {
    res.status(400)
  }
}); 

// PUT api/posts/1-- update a post's title
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

// DELETE api/posts/1 -- delete a post
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
        res.json(dbPostData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;