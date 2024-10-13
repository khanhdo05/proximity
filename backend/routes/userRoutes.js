// backend/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const connectDB = require('../config/connect');
const router = express.Router();
const mongoose = require('mongoose');
// Signup route
router.post('/signup', async (req, res) => {
  const { username, professional, dating, chatting, currentLabel } = req.body;
  try {
    const newUser = new User({
      username: username,
      location: { x: 0, y: 0, lastUpdated: 0 },
      labels: {
        professional: professional,
        dating: dating,
        chatting: chatting,
      },
      currentLabel: currentLabel,
      isLocationOn: true,
    });
    console.log('saving user');
    await newUser.save();
    res.status(201).send(newUser);
  } catch (error) {
    if (error.code === 11000) {
      console.log('AAA', error);
      res.status(400).json({ message: 'Username already taken' });
    } else {
      console.log('got error');
      console.log(`error ${error}`);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
});

router.post('/updateLoc', async (req, res) => {
  let data = req.body;
  console.log(`Got data ${JSON.stringify(data)}`);
  let long = data.longitude;
  let lat = data.latitude;
  let timestamp = data.timestamp;
  let uid = data.uid;
  await User.findByIdAndUpdate(uid, {
    location: { x: lat, y: long, lastUpdated: timestamp },
  }).exec();
  // await User.findByIdAndUpdate(uid, {
  //   'location.y': long,
  //   'location.x': lat,
  //   'location.lastUpdated': timestamp,
  // }).exec();
  res.status(200).send("OK");
  console.log(`just updated, x is ${lat} for uid ${uid}`);
});

router.post('/updateLabel', async (req, res) => {
  let data = req.body;
  let labelSelector = data.labelSelector; //selector
  let uid = data.userid;
  await User.findByIdAndUpdate(uid, { currentLabel: labelSelector }).exec();
  res.status(200).send("OK");
});
const earthRadiusM = 6_378_000;
const distThresholdM = 200;
const distThresholdR = distThresholdM / earthRadiusM;
const showUserDelaySec = 10;
router.post('/getNearbyUsers', async (req, res) => {
  //list of (object_id, label)
  // console.log('Got request');
  let data = req.body;
  let long = data.longitude;
  let lat = data.latitude;
  let labelSelector = data.labelSelector;
  console.log('got data ' + JSON.stringify(data));
  let timestamp = data.timestamp;
  //User.$where((u) => (earthRadiusM * (u.longitude - long))**2 + (earthRadiusM * (u.latitude - lat))**2  < distThresholdM &&
  //  timestamp - u.lastUpdated < 1000 * showUserDelaySec).select(`_id labels.${labelSelector}`).exec().then(res.send)

  try {User.find({})
    .where('location.x')
    .gt(lat - distThresholdR)
    .lt(lat + distThresholdR)
    .where('location.y')
    .gt(long - distThresholdR)
    .lt(long + distThresholdR)
    .where('location.lastUpdated')
    .gt(timestamp - showUserDelaySec * 1000)
    .where('currentLabel')
    .equals(labelSelector)
    .select(`_id labels.${labelSelector}`)
    .then((a) => {
      let b = a.map((o) => [o._id, o.labels[labelSelector]]);
      res.status(200).send(b);
    });
  }
  catch(e) {
    res.status(500).send()
  }
  // try {User.find({}).then(a => res.send(a)); }
  // catch(error) {
  //   res.send("oh no")
  // }
});

router.post('/getNearbyRequests', async (req, res) => {
  let data = req.body;
  let uid = data.uid;
  let long = data.longitude;
  let lat = data.latitude;
  let labelSelector = data.labelSelector;
  let timestamp = data.timestamp;
  console.log('got data ' + JSON.stringify(data));
  User.find({ activeOutboundRequests: $in[uid] })
    .where('location.x')
    .gt(lat - distThresholdR)
    .lt(lat + distThresholdR)
    .where('location.y')
    .gt(long - distThresholdR)
    .lt(long + distThresholdR)
    .where('location.lastUpdated')
    .gt(timestamp - showUserDelaySec * 1000)
    .where('currentLabel')
    .equals(labelSelector)
    .select(`_id labels.${labelSelector}`)
    .then((a) => {
      let b = a.map((o) => [o._id, o.labels[labelSelector]]);
      res.status(200).send(b);
    });
});

router.post('/updateLocationOn', async (req, res) => {
  let data = req.body;
  let uid = data.uid;
  let locationOn = data.isLocationOn;
  console.log("location on:", locationOn);
  User.findByIdAndUpdate(uid, {isLocationOn: locationOn}).then((user) => {res.status(200).send(user)});
});


router.post('/getCurrentChatUserId', async (req, res) => {
  User.findById(req.body.uid).select('currentChatUserId').then(a=>res.status(200).send(a));
})

module.exports = router;
