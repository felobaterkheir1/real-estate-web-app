import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../firebase.config';
import googleIcon from '../../assets/svg/googleIcon.svg';

const OAuth = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const onGoogleClick = async() =>{
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Get user from doc of firestore
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            // check if it's exists
            if(!docSnap.exists()){
                await setDoc(doc(db, 'users', user.uid), {
                    name: user.displayName,
                    email: user.email,
                    timestamp: serverTimestamp()
                })
            }
            navigate('/')
        } catch (error) {
            if(location.pathname === '/signin'){
                toast.error("Couldn't Sign in with this Gmail")
            }else{
                toast.error("Couldn't Sign Up with this Gmail")
            }
        }
    }

  return (
    <div className='socialLogin'>
      <p>Sign {location.pathname === '/signup' ? 'Up' : 'In'} with</p>
      <button className='socialIconDiv'>
        <img className='socialIconImg' onClick={onGoogleClick} src={googleIcon} alt='google'/>
      </button>
    </div>
  )
}

export default OAuth
