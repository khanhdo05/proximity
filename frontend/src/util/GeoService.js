import axios from 'axios';
import React, { useEffect } from 'react';

//insert if location is on
function GeoService(userid, username, labelSelector, labelValue, setNearbyUsers) {
    //
    // userid = "670adadf129a893f730eaaa5";
    // username = "mouse"
    // labelSelector = "professional"
    // labelValue = "dog"
    // setNearbyUsers = console.log
    //mock
    //
    const checkLocDelaySec = 3;
    window.navigator.geolocation.getCurrentPosition(console.log)
    useEffect(()=> {axios.post("http://localhost:8080/api/user/updateLabel", {"labelSelector" : labelSelector, "uid":userid})}, [labelSelector]) //update label in db when label is updated on frontend
    async function handleLoc(loc) {
        console.log("about to send location")
        let nearbyUsers
        try {
        nearbyUsers = (await axios.post("http://localhost:8080/api/user/getNearbyUsers", {"latitude" : loc.coords.latitude, "longitude":loc.coords.longitude, 
            "labelSelector" : labelSelector, "timestamp" : loc.timestamp})).data
        }
        catch (e) {
            console.log(e)
        }
            console.log("gsdgdg")
        console.log(`Got ${(nearbyUsers)}`)
            setNearbyUsers(nearbyUsers)//.filter(t => t[0] !== userid))
            await axios.post("http://localhost:8080/api/user/updateLoc", {"latitude" : loc.coords.latitude, "longitude": loc.coords.longitude, "timestamp" : loc.timestamp, "uid" : userid})
            // await new Promise(r => setTimeout(r, checkLocDelaySec * 1000));
        }
    setInterval(()=> {console.log("starting location"); window.navigator.geolocation.getCurrentPosition(handleLoc)}, checkLocDelaySec * 1000)
    // useEffect(()=>{window.navigator.geolocation.watchPosition(handleLoc, ()=>{})})
    
    return <></>
}
export default GeoService;