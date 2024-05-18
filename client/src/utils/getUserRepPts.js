import axios from "axios";

export default async function getUserPtn(userId){
    let res = await axios.get("http://127.0.0.1:8000/profile/getReputation/" + userId);
    return res.data; 
}