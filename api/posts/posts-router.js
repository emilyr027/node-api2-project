const Post = require('../db-helpers');
const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
 Post.find()
    .then((data) => {
        res.status(200).json(data)
    })
    .catch(error => {
        res.status(500).json({ error: "The posts information could not be retrieved." })
    })
})

router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
        if(post.length > 0) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        res.status(500).json({ error: "The post information could not be retrieved." })
    })
})

router.get('/:id/comments', (req, res) => {
    Post.findById(req.params.id)
    .then(post => {
        if(!post.length) {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        } else {
            Post.findPostComments(req.params.id)
            .then(comments => {
                res.status(200).json(comments)
        }) .catch(error => {
            res.status(500).json({ error: "The comments information could not be retrieved." })
        })
    }
}) .catch(error => {
    res.status(500).json({ error: "The comments information could not be retrieved." })
})
})

router.post('/', (req, res) => {
    if(!req.body.title || !req.body.contents) {
      res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    }
 Post.insert(req.body)
      .then((post) => {
        res.status(201).json(post)
      })
      .catch(error => {
        console.log(error)      
        res.status(500).json({ error: "There was an error while saving the post to the database" })
      })
  })
  

router.post('/:id/comments', (req, res) => {
    const { text } = req.body;
    const { id: post_id } = req.params;
   
    if (!text) {
      return res
        .status(400).json({ message: "Please provide text for the comment" })
    }
  
    Post.insertComment({ text, post_id })
      .then((comment) => {
        console.log(comment)
        if (!comment.id) {
          res.status(404).json({ message: "The post with the specified ID does not exist" })
        } else {
          res.status(201).json(comment)
        }
      })
      .catch((error) => {
        console.log(error)
        res.status(500).json({ error: "There was an error while saving the comment to the database" })
      })
  })


  router.put('/:id', (req, res) => {
    if(!req.body.title || !req.body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
      }
    const changes = req.body
    Post.update(req.params.id, changes)
    .then(post => {
        if (post) {
            res.status(200).json(post)
            } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The post information could not be modified." })
    })
})


router.delete('/:id', (req, res) => {
    Post.remove(req.params.id)
    .then(post => {
        if (post > 0) {
            res.status(200).json({ message: 'The post has been deleted.' })
            } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(error => {
        console.log(error)
        res.status(500).json({ error: "The post could not be removed" })
    })
})



module.exports = router