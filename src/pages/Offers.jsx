import React, {useEffect, useState} from 'react';
import { GridLoader } from 'react-spinners'
import { useParams } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import ListingItem from '../components/layout/ListingItem';


const Offers = () => {

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        // Get Reference it's a reference to the collection not the document
        const listingRef = collection(db, "listing");

        // Create a Query
        const q = query(listingRef, 
          where('offer', '==', true), 
          orderBy('timestamp', 'desc'), 
          limit(10)
          );

        // Execute the query
        const querySnap = await getDocs(q);
        const fetchedListing = [];
        querySnap.forEach((doc) => {
          return fetchedListing.push({
            id: doc.id,
            data: doc.data()
          })
        })
        setListing(fetchedListing);
        setLoading(false)
      } catch (error) {
        toast.error("Couldn't find any data")
      }
    }
    fetchListing()
  }, [])

  return (
    <div className='category'>
     <header>
      <p className="pageHeader">
        Offers
      </p>
     </header>

     
      {loading ? <div  className='loadingSpinnerContainer'>
        <GridLoader size={40} width={30} margin={10} speedMultiplier={2} color='#36d7b7' />
      </div> : listing && listing.length > 0 ? <>
        <main>
          <ul className="categoryListings">
            {listing.map((listing) => (
              <ListingItem listing={listing.data} id={listing.id} key={listing.id} />
            ))}
          </ul>
        </main>
      </> : <p>No Offers are Existing in the mean time</p>} 
     
    </div>
  )
}

export default Offers;

