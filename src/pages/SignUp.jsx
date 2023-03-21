import React, {Fragment, useState} from 'react';
import { BsFillEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import {Link, useNavigate} from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import OAuth from '../components/layout/OAuth';
 

const SignUp = () => {

  const [ showPassword, setShowPassword ] = useState(false);
  const [ formData, setFormData ] = useState({
    name: '',
    email: '',
    password: ''
  });

  const {name, email, password } = formData;
  const navigate = useNavigate();

  const handleInput = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id] : e.target.value
    }))
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();
    try {
      const auth = getAuth();

      const userCredentials = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredentials.user;

      updateProfile(auth.currentUser, {
        displayName: name,
      })

      const formDataCopy = {...formData};
      delete formDataCopy.password;
      formDataCopy.timeStamp = serverTimestamp();

      await setDoc(doc(db, 'users', user.uid), formDataCopy);
      navigate('/')
    } catch (error) {
      toast.error("Bad User Credentials")
    }
  }

  return (
    <Fragment>
      <div className="pageContainer">
        <header>
          <p className="pageHeader">
            Welcome Back!
          </p>
        </header>

        <main>
          <form onSubmit={handleSubmit}>

            <input type="text" className="nameInput" placeholder='Name' id='name' value={name} onChange={handleInput} />

            <input type="email" className="emailInput" placeholder='Email' id='email' value={email} onChange={handleInput} />
            
            <div className="passwordInputDiv">
              <input type={showPassword ? 'text' : 'password'} className='passwordInput' id='password' value={password} onChange={handleInput} placeholder='Password'/>

              <div className='showPassword' onClick={() => setShowPassword((prevState) => !prevState) }>
                {showPassword ? <BsEyeSlashFill size={30}/> : <BsFillEyeFill size={30}/>}
              </div>
            </div>

            <Link to='/forgetpassword' className='forgotPasswordLink'>
              forgot password
            </Link>

            <div className="signInBar">
              <p className="signInText">Sign Up</p>
              <button className="signInButton">
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
              </button>
            </div>
          </form>
        </main>

        {/* Googel OAuth */}
        <OAuth />  

        <Link className='registerLink' to='/signin'>
          Sign In Instead  
        </Link> 
      </div>
    </Fragment>
  )
}

export default SignUp

