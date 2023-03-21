import React, { useState } from 'react';
import { getAuth, updateEmail, updateProfile } from 'firebase/auth';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ArrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import HomeIcon from '../assets/svg/homeIcon.svg';

const Profiles = () => {

  const auth = getAuth();

  const [ changeDetails, setChangeDetails ] = useState(false);
  const [ formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const { name, email } = formData
  const navigate = useNavigate();

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  const onSubmit = async ( ) => {
    try {
      if(auth.currentUser.displayName !== name){
        // update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name
        })

        // update name in the fireStore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          name,
        });
      }
      if (auth.currentUser.email !== email) {
        // update email in firebase
        await updateEmail(auth.currentUser, email);

        // update email in firestore
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          email
        });
      }
    } catch (error) {
      toast.error("Couldn't update Personal Details")      
    }
  }
  return (
    
    <div className='profile'>
      <header className="profileHeader">
        <p className="pageHeader">
          My Profile
        </p>
        <button type='button' className="logOut" onClick={onLogout}>Logout</button>
      </header>

      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">personal Details</p>
          <p className="changePersonalDetails" onClick={() => {
            changeDetails && onSubmit();
            setChangeDetails((prevState) => !prevState);
          }}>
            {changeDetails ? 'done' : 'change' }
          </p>
        </div>

        <div className="profileCard">
          <form>
            <input type="text"  id="name" className={!changeDetails ? "profileName" : "profileNameActive"} disabled={!changeDetails} value={name} onChange={onChange} />
            <input type="text"  id="email" className={!changeDetails ? "profileEmail" : "profileEmailActive"} disabled={!changeDetails} value={email} onChange={onChange} />
          </form>
        </div>
        
          <Link to='/create-listing' className='createListing'>
              <img src={HomeIcon} alt="home" />
              <p>Sell Or Rent your home</p>
              <img src={ArrowRight} alt="go-right"  />
          </Link>
      </main>
    </div>
      
  )
}

export default Profiles
