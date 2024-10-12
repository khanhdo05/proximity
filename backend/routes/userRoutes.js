// backend/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const connectDB = require('../config/connect');
const router = express.Router();
// Signup route
router.post('/signup', async (req, res) => {
  const { username } = req.body;
  try {
    const newUser = new User({ username });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: 'Username already taken' });
    } else {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

router.post('/updateLoc', async (req, res) => {
  let data = req.body;
  let long = data.longitude;
  let lat = data.latitude;
  let timestamp = data.timestamp;
  let uid = data.userid;
  User.findByIdAndUpdate(uid, {"longitude" : long, "latitude": lat, "lastUpdated": timestamp});

})

router.post('/updateLabel', async (req,res) => {
  let data = req.body;
  let labelSelector = data.labelSelector; //selector
  let uid = data.userid;
  User.findByIdAndUpdate(uid, {"currentLabel" : labelSelector})

})
const earthRadiusM = 6_378_000
const distThresholdM = 200
const distThresholdR = distThresholdM / earthRadiusM
const showUserDelaySec = 20
router.post('/getNearbyUsers', async (req,res) => { //list of (object_id, label)
  console.log("Got request")
  let data = req.body;
  let long = data.longitude;
  let lat = data.latitude;
  let labelSelector = data.labelSelector;
  console.log("got data " + JSON.stringify(data) )
  let timestamp = data.timestamp;
  //User.$where((u) => (earthRadiusM * (u.longitude - long))**2 + (earthRadiusM * (u.latitude - lat))**2  < distThresholdM &&
  //  timestamp - u.lastUpdated < 1000 * showUserDelaySec).select(`_id labels.${labelSelector}`).exec().then(res.send)
  
  User.where("longitude").gt(long - distThresholdR).lt(long + distThresholdR).
      where("latitude").gt(lat - distThresholdR).lt(lat + distThresholdR).
      where("lastUpdated").gt(timestamp-showUserDelaySec * 1000).select(`_id labels.${labelSelector}`).exec().then(a => res.send())
})
module.exports = router;
