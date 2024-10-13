const express = require('express');
const User = require('../models/User');
const MeetupRequest = require('../models/MeetupRequest');
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
  res.status(200).send('OK');
  console.log(`just updated, x is ${lat} for uid ${uid}`);
});

router.post('/updateLabel', async (req, res) => {
  let data = req.body;
  let labelSelector = data.labelSelector; //selector
  let uid = data.userid;
  await User.findByIdAndUpdate(uid, { currentLabel: labelSelector }).exec();
  res.status(200).send('OK');
});

const earthRadiusM = 6_378_000;
const distThresholdM = 200000;
const distThresholdR = distThresholdM / earthRadiusM;

router.post('/getNearbyUsers', async (req, res) => {
  let data = req.body;
  let long = data.longitude;
  let lat = data.latitude;
  let labelSelector = data.labelSelector;
  console.log('got data ' + JSON.stringify(data));
  let timestamp = data.timestamp;

  try {
    User.find({})
      .where('location.x')
      .gt(lat - distThresholdR)
      .lt(lat + distThresholdR)
      .where('location.y')
      .gt(long - distThresholdR)
      .lt(long + distThresholdR)
      .where('isLocationOn')
      .equals(true)
      .where('currentLabel')
      .equals(labelSelector)
      .select(`_id labels.${labelSelector}`)
      .then((a) => {
        let b = a.map((o) => [o._id, o.labels[labelSelector]]);
        res.status(200).send(b);
      });
  } catch (e) {
    res.status(500).send();
  }
});

router.post('/getNearbyRequests', async (req, res) => {
  let data = req.body;
  let uid = data.uid;
  let long = data.longitude;
  let lat = data.latitude;
  let labelSelector = data.labelSelector;
  let timestamp = data.timestamp;
  console.log('got data ' + JSON.stringify(data));

  try {
    const nearbyUsers = await User.find({
      activeOutboundRequests: { $in: [uid] },
    })
      .where('location.x')
      .gt(lat - distThresholdR)
      .lt(lat + distThresholdR)
      .where('location.y')
      .gt(long - distThresholdR)
      .lt(long + distThresholdR)
      .where('isLocationOn')
      .equals(true)
      .where('currentLabel')
      .equals(labelSelector)
      .select(`_id labels.${labelSelector}`);

    const requests = await MeetupRequest.find({
      receiverId: uid,
      senderId: { $in: nearbyUsers.map((user) => user._id) },
      status: 'pending',
    }).populate('senderId', `username labels.${labelSelector}`);

    const result = requests.map((req) => [
      req.senderId._id,
      req.senderId.labels[labelSelector],
      req._id, // Include the request ID
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching nearby requests:', error);
    res.status(500).json({ message: 'Error fetching nearby requests' });
  }
});

router.post('/updateLocationOn', async (req, res) => {
  let data = req.body;
  let uid = data.uid;
  let locationOn = data.isLocationOn;
  console.log('location on:', locationOn);
  User.findByIdAndUpdate(uid, { isLocationOn: locationOn }).then((user) => {
    res.status(200).send(user);
  });
});

// New route: Send a meetup request
router.post('/sendMeetupRequest', async (req, res) => {
  const { senderId, receiverId, senderLabel } = req.body;
  console.log('Received meetup request:', {
    senderId,
    receiverId,
    senderLabel,
  });
  try {
    const newRequest = new MeetupRequest({
      senderId,
      receiverId,
      senderLabel,
      status: 'pending',
    });
    const savedRequest = await newRequest.save();
    console.log('Saved meetup request:', savedRequest);

    await User.findByIdAndUpdate(senderId, {
      $addToSet: { activeOutboundRequests: receiverId },
    });

    res.status(201).json({
      success: true,
      message: 'Meetup request sent successfully',
      request: savedRequest,
    });
  } catch (error) {
    console.error('Error sending meetup request:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error sending meetup request' });
  }
});

// New route: Get received meetup requests
router.get('/getReceivedRequests/:userId', async (req, res) => {
  try {
    const requests = await MeetupRequest.find({
      receiverId: req.params.userId,
      status: 'pending',
    }).populate('senderId', 'username labels');

    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching received requests:', error);
    res.status(500).json({ message: 'Error fetching received requests' });
  }
});

// New route: Accept a meetup request
router.post('/acceptMeetupRequest', async (req, res) => {
  const { requestId, userId } = req.body;
  try {
    const request = await MeetupRequest.findOneAndUpdate(
      { _id: requestId, receiverId: userId },
      { status: 'accepted' },
      { new: true }
    );

    if (request) {
      await User.findByIdAndUpdate(request.senderId, {
        $pull: { activeOutboundRequests: userId },
      });

      res
        .status(200)
        .json({ success: true, message: 'Meetup request accepted' });
    } else {
      res
        .status(404)
        .json({ success: false, message: 'Meetup request not found' });
    }
  } catch (error) {
    console.error('Error accepting meetup request:', error);
    res
      .status(500)
      .json({ success: false, message: 'Error accepting meetup request' });
  }
});

module.exports = router;
