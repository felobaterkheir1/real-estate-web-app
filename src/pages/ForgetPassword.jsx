import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
import { ReactComponent as Arrowright } from '../assets/svg/keyboardArrowRightIcon.svg';

const ForgetPassword = () => {

  const [sendEmail, setSendEmail] = useState('');

  const handleChange = (e) => {
    setSendEmail(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, sendEmail);
      toast.success("Email reset password was sent")
    } catch (err) {
      toast.error("Couldn't send a reset Email")
    }
  }
  return (
    <div className='pageContainer'>
      <header>
        <p className="pageHeader">Forgot Password</p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <input type="email" className='emailInput' id="email" value={sendEmail} onChange={handleChange} placeholder='Email' />
          <Link className='forgotPasswordLink' to='/signin'>sign in</Link>

          <div className="signInBar">
            <div className="signInText">Send Reset Link</div>
            <button className="signInButton">
              <Arrowright fill='#ffffff' width='34px' height='34px' />
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default ForgetPassword
