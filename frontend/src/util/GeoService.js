import axios from 'axios';
import React, { useEffect } from 'react';

//insert if location is on
const GeoService = (props) => {
  const { userid, labelSelector, setNearbyUsers } = props;

  const checkLocDelaySec = 2;
  //   window.navigator.geolocation.getCurrentPosition(handleLoc);
  useEffect(() => {
    console.log(`userid ${JSON.stringify(userid)}`);
    axios
      .post('http://localhost:8080/api/user/updateLabel', {
        labelSelector: labelSelector,
        uid: userid,
      })
      .catch((e) => {
        console.log('failed to update label', e);
      });
  }, [labelSelector]); //update label in db when label is updated on frontend
  async function handleLoc(loc) {
    let nearbyUsers;
    try {
      nearbyUsers = (
        await axios.post('http://localhost:8080/api/user/getNearbyUsers', {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          labelSelector: labelSelector,
          timestamp: loc.timestamp,
        })
      ).data;
      console.log('Got these nearby users', nearbyUsers);
    } catch (e) {
      console.log(e);
    }
    console.log(`Got ${nearbyUsers}`);
    if (nearbyUsers) setNearbyUsers(nearbyUsers.filter((t) => t[0] !== userid));
    // setNearbyUsers(nearbyUsers.filter((t) => t[0] !== userid));
    console.log(`Sending data uid ${userid}`);
    await axios.post('http://localhost:8080/api/user/updateLoc', {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      timestamp: loc.timestamp,
      uid: userid,
    });
  }
  useEffect(() => {
    const intervalId = setInterval(() => {
      window.navigator.geolocation.getCurrentPosition(handleLoc);
    }, checkLocDelaySec * 1000);

    return () => clearInterval(intervalId);
  }, []);
  return <></>;
};
export default GeoService;
