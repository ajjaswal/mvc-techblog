// User facing routes from handlebars
//Dependencies
// Router
const router = require('express').Router();
// Sequelize and the Post, User, and Comment Models
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models')

// Route to get the homepage and render all the posts
router.get('/', (req, res) => {
    // console log the session information
    // console.log(req.session)
    // get the posts from the database
    Post.findAll({
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
          {
            model: Comment,
            attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
      })
        .then(dbPostData => {
            // create an array for the posts, using the get method to trim extra sequelize object data out
          const posts = dbPostData.map(post => post.get({ plain: true }));
          // pass the posts into the homepage template
          res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    });

// Route to render a single post page using Sequelize findOne route
router.get('/post/:id', (req, res) => {
    Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
          res.status(404).json({ message: 'No post found with this id' });
          return;
        }
  
        // serialize the data
        const post = dbPostData.get({ plain: true });
  
        // pass data to template for the post and for if there is an active session, i.e. a logged in user
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
          });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// Route to render the login page
router.get('/login', (req, res) => {
    // if a session is already detected, reroute to the homepage
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
      }
    // otherwise, render the login page
    res.render('login');
});

// Export the router
module.exports = router;