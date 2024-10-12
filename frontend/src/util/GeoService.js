import axios from 'axios';
import React, { useEffect } from 'react';

//insert if location is on
function GeoService(username, label, setNearbyUsers) {
    const updateNearbyDelaySec = 5;
    const uploadLocationDelaySec = 1;
    window.navigator.geolocation.getCurrentPosition(console.log)
    useEffect(()=> {})
    useEffect(()=> {
        setInterval(async ()=>{
            
        }, updateNearbyDelaySec * 1000);
        setInterval(async () => {
            window.navigator.geolocation.getCurrentPosition((loc) => {
                axios.post("/api/user/updateLoc", {"latitude" : loc.coords.latitude, "longitude": loc.coords.longitude, "timestamp" : loc.timestamp})
            })
        }, uploadLocationDelaySec * 1000)},
    [])

}
export default GeoService;