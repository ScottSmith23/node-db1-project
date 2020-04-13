const express = require('express');

// database access using knex
const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
    db.select("*")
    .from("accounts")
    .then(accounts => {
        res.status(200).json({data: accounts});
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error : error.message});
    })
});

router.get('/:id', (req, res) => {
    db("accounts")
    .where({id: req.params.id})
    .first()
    .then(account => {
        res.status(200).json({data: account});
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error : error.message});
    })
});

router.post('/', (req, res) => {
    const accountData = req.body;
    db("accounts")
    .insert(accountData, "id")
    .then(ids => {
        const id = ids[0];
        db("accounts")
        .where({id})
        .first()
        .then(account => {
            res.status(200).json({data:account});
        })
    })
    .catch(error => {
        console.log(error);
        res.status(500).json({error : error.message});
    })
});

router.patch('/:id', (req, res) => {
    const changes = req.body;
    const {id} = req.params;
   
    db("accounts")
     .where({id})
     .update(changes)
     .then(count => {
         if(count > 0) {
             res.status(200).json({message: `account has been updated`})
         } else {
           res.status(404).json({message:'no account with that ID'})
         }
     })
   
   });

   router.delete('/:id', (req, res) => {
    const {id} = req.params;
    
        db("accounts")
        .where({id})
        .delete()
        .then(count => {
            if(count > 0) {
                res.status(200).json({message: `account has been deleted`})
            } else {
              res.status(404).json({message:'no account with that ID'})
            }
        })
    
    
    });
    

module.exports = router;