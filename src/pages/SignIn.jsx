import React, {Fragment, useState} from 'react';
import { BsFillEyeFill, BsEyeSlashFill } from 'react-icons/bs'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify';
import {Link, useNavigate} from 'react-router-dom';
import { ReactComponent as ArrowRightIcon } from '../assets/svg/keyboardArrowRightIcon.svg';
import OAuth from '../components/layout/OAuth';
 

const SignIn = () => {

  const [ showPassword, setShowPassword ] = useState(false);
  const [ formData, setFormData ] = useState({
    email: '',
    password: ''
  });

  const {email, password } = formData;
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
      const userCredentials = await signInWithEmailAndPassword(auth,  email, password);
      if(userCredentials.user){
        navigate('/')
      }
    } catch (error) {
      toast.error('Bad User Credentials')
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


          <form onSubmit={handleSubmit}>
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
              <p className="signInText">Sign In</p>
              <button className="signInButton">
                <ArrowRightIcon fill='#ffffff' width='34px' height='34px'/>
              </button>
            </div>
          </form>
        

        {/* Googel OAuth */}
        <OAuth />  

        <Link className='registerLink' to='/signup'>
          Sign Up Instead  
        </Link> 
      </div>
    </Fragment>
  )
}

export default SignIn
