const sequelize = require('../config/connection');
const { User, Post } = require('../models');

const userdata = [
  {
    username: 'jaswalaj22',
    email: 'kal@cbc.ca',
    password: 'password123'
  },
  {
    username: 'jaswalaj23',
    email: 'pomopm@sogou.com',
    password: 'password123'
  },
  {
    username: 'jaswalaj24',
    email: 'sfoins@last.fm',
    password: 'password123'
  },
  {
    username: 'jaswalaj25',
    email: 'iusgb@goo.ne.jp',
    password: 'password123'
  },
  {
    username: 'jaswalaj26',
    email: 'trgrh@weather.com',
    password: 'password123'
  },
  {
    username: 'jaswalaj27',
    email: 'xcvbc@imdb.com',
    password: 'password123'
  },
  {
    username: 'jaswalaj28',
    email: 'qwewq@feedburner.com',
    password: 'password123'
  },
  {
    username: 'jaswalaj29',
    email: 'opjgf@china.com.cn',
    password: 'password123'
  },
  {
    username: 'jaswalaj30',
    email: 'imijiji@google.ru',
    password: 'password123'
  },
  {
    username: 'jaswalaj31',
    email: 'asasfg@epa.gov',
    password: 'password123'
  }
];

const seedUsers = () => User.bulkCreate(userdata, {individualHooks: true});

module.exports = seedUsers;
