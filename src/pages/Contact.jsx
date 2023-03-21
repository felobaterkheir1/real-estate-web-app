import React, {useEffect, useState} from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import { GridLoader } from 'react-spinners';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';



const Contact = () => {

  const [message, setMessage] = useState('');
  const [Landlord, setLandlord] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useParams();

  useEffect(() => {

    const getLandlord = async() =>{
      const docUser = doc(db, 'users', params.landlordId);
      const docSnap = await getDoc(docUser);

      if(docSnap.exists()){
        setLandlord(docSnap.data());
      }else{
        toast.error("Couldn't get the landlord data")
      }
    }

    getLandlord()
  }, [params.landlordId])

  const handleChange = (e) => {
    setMessage(e.target.value);
  }
  

  return (
    <div className='pageContainer'>
      <header>
        <p className="pageHeader">
          Contact Landlord
        </p>
      </header>

      {
        Landlord !== null && (
          <main>
            <div className='contactLandlord'>
              <p className="landlordName">
                Contact {Landlord?.name}
              </p>
            </div>

            <form className="messageForm">
              <div className="messageDiv">
                <label htmlFor='message' className="messageLabel">Message</label>
                <textarea name="message" id="message" className='textarea' value={message} onChange={handleChange}></textarea>
              </div>

              <a href={`mailto:${Landlord.email}?Subject=${
                searchParams.get('listingName')
              }&body=${message}`}>
                <button type='button' className="primaryButton">Send Message</button>
              </a>
            </form>
          </main>
        )
      }

    </div>
  )
}

export default Contact
