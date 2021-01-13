const express = require('express');
const server = express();

const postsRouter = require('../api/posts/posts-router');

server.use(express.json());

server.use('/api/posts', postsRouter);

// OTHER ENDPOINTS
// OTHER ENDPOINTS
// OTHER ENDPOINTS
server.get('/', (req, res) => {
    res.send(`
      <h2>View Social Media Posts</h>
    `);
  });
  
  // we expose the server
  module.exports = server