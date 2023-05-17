const express = require('express');
const router = express.Router();

router.get('/createTask', async function (req, res) {

    try {

        const newTask = new Task();
        const data = await newTask.save();
        res.redirect('/task/' + data._id);
    } catch (err) {
        console.log(err);
        res.render('error');
    }

});

router.get('/task/:id', async function (req, res) {
    if (req.params.id) {
        try {
            const data = await Task.findOne({ _id: req.params.id });

            if (data) {

                res.render('task', { data: data, roomId: data.id });
            } else {
                res.render('error');
            }
        } catch (err) {
            console.log(err);
            res.render('error');
        }
    } else {
        res.render('error');
    }


});

module.exports = router;
