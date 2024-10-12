import axios from 'axios';
import React, { useEffect } from 'react';

//insert if location is on
function GeoService(userid, username, labelSelector, labelValue, setNearbyUsers) {
    //
    userid = -1
    username = "dog"
    labelSelector = "professional"
    labelValue = "dog"
    setNearbyUsers = console.log
    //mock
    //
    const checkLocDelaySec = 1;
    window.navigator.geolocation.getCurrentPosition(console.log)
    useEffect(()=> {axios.post("http://localhost:8080/api/user/updateLabel", {"labelSelector" : labelSelector, "uid":userid})}, [labelSelector]) //update label in db when label is updated on frontend
    async function handleLoc(loc) {
        let nearbyUsers = (await axios.post("http://localhost:8080/api/user/getNearbyUsers", {"latitude" : loc.coords.latitude, "longitude":loc.coords.longitude, 
            "labelSelector" : labelSelector, "timestamp" : loc.timestamp})).data
        console.log(`Got ${(nearbyUsers)}`)
            setNearbyUsers(nearbyUsers)//.filter(t => t[0] !== userid))
            axios.post("http://localhost:8080/api/user/updateLoc", {"latitude" : loc.coords.latitude, "longitude": loc.coords.longitude, "timestamp" : loc.timestamp, "uid" : userid})
            await new Promise(r => setTimeout(r, checkLocDelaySec * 1000));
        }
    window.navigator.geolocation.watchPosition(handleLoc, ()=>{})
    return <></>
}
export default GeoService;