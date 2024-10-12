import axios from 'axios';
import React, { useEffect } from 'react';

//insert if location is on
function GeoService(username, label, setNearbyUsers) {
    const updateNearbyDelaySec = 5;
    const uploadLocationDelaySec = 1;
    window.navigator.geolocation.getCurrentPosition(console.log)
    useEffect(()=> {axios.post("/api/user/updateLabel", {"label" : label})}, [label]) //update label in db when label is updated on frontend
    useEffect(()=> {
        setInterval(async ()=>{
            window.navigator.geolocation.getCurrentPosition(async (loc) => {
                let nearbyUsers = await axios.post("api/user/getNearbyUsers", {"latitude" : loc.coords.latitude, "longitude":loc.coords.longitude}) //todo
                setNearbyUsers(nearbyUsers.filter(t=> t[0] != username))
            })
        }, updateNearbyDelaySec * 1000);
        setInterval(async () => {
            window.navigator.geolocation.getCurrentPosition((loc) => {
                axios.post("/api/user/updateLoc", {"latitude" : loc.coords.latitude, "longitude": loc.coords.longitude, "timestamp" : loc.timestamp, "username" : username})
            })
        }, uploadLocationDelaySec * 1000)},
    [])

}
export default GeoService;