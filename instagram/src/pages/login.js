import {useHistory} from 'react-router-dom';
import FirebaseContext from '../context/firebase'
import {useState,useContext,useEffect } from 'react';


export default function Login(){
    const history=useHistory();
    const {firebase} = useContext(FirebaseContext)

    const [emailAdress,setEmailAdress]=useState('');
    const [password,setPassword]=useState('');

    const[error,setError]=useState();
    const isInvalid = password === '' || emailAdress === '';

    const handleLogin=()=>{};

    useEffect(()=>{
        document.title='Login - Instagram';
    },[]);
    return (
        <div className='container flex mx-auto max-w-screen-md items-center h-screen text-red-500'>
            <div className='flex w-3/5'>
                <img src="/images/iphone-with-profile.jpg" alt="iphone with Instagram" />
            </div>
    </div>);
}