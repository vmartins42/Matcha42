const express = require ("express")
const router = express.Router()
const query = require('../config')

router.get('/:hash', async (req, res) => {
    // PASSSSSER VALID A 1 
    
    query(`update users set valid = '1' where hash = '${req.params.hash}'`)
    .then (result => {
        if (result.rowCount === 1) 
            return res.redirect('http://localhost:3000/emailvalidation');
        else
            return res.status(400).send({ error: "Une erreur est survenue, reesayez"})
    })
    .catch (err => {
        return res.status(400).send({ error: "Une erreur est survenue, reesayez"})
    })
})


module.exports = router