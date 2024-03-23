import {useParams,useHistory} from 'react-router-dom'
import { useState, useEffect} from 'react';

export default function Profile(){
    const {username}=useParams();
    const [userExists,setUserExists]=useState(false)

    useEffect(() => {
      async function checkUserExists(){
        const doesUserExist= await getUserByUsername(username)
      }
    }, [])
    
    return null;
}

//7:48