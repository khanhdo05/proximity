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
            nearbyUsers = await axios.get("api/user/getNearbyUsers", )
            setNearbyUsers(nearbyUsers.map(()=>0)) //todo
        }, updateNearbyDelaySec * 1000);
        setInterval(async () => {
            window.navigator.geolocation.getCurrentPosition((loc) => {
                axios.post("/api/user/updateLoc", {"latitude" : loc.coords.latitude, "longitude": loc.coords.longitude, "timestamp" : loc.timestamp})
            })
        }, uploadLocationDelaySec * 1000)},
    [])

}
export default GeoService;