import axios from 'axios';
import React, { useEffect } from 'react';

//insert if location is on
function GeoService(userid, username, labelSelector, labelValue, setNearbyUsers) {
    const updateNearbyDelaySec = 5;
    const uploadLocationDelaySec = 1;
    window.navigator.geolocation.getCurrentPosition(console.log)
    useEffect(()=> {axios.post("/api/user/updateLabel", {"labelSelector" : labelSelector, "uid":userid})}, [labelSelector]) //update label in db when label is updated on frontend
    useEffect(()=> {
        setInterval(async ()=>{
            window.navigator.geolocation.getCurrentPosition(async (loc) => {
                let nearbyUsers = await axios.post("api/user/getNearbyUsers", {"latitude" : loc.coords.latitude, "longitude":loc.coords.longitude, 
                    "labelSelector" : labelSelector, timestamp : loc.timestamp
                })
                setNearbyUsers(nearbyUsers.filter(t=> t[0] != userid))
            })
        }, updateNearbyDelaySec * 1000);
        setInterval(async () => {
            window.navigator.geolocation.getCurrentPosition((loc) => {
                axios.post("/api/user/updateLoc", {"latitude" : loc.coords.latitude, "longitude": loc.coords.longitude, "timestamp" : loc.timestamp, "uid" : userid})
            })
        }, uploadLocationDelaySec * 1000)},
    [])

}
export default GeoService;