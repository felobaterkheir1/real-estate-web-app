import React, {useState, useEffect} from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase.config';
import { GridLoader } from 'react-spinners';
import ShareIcon from '../assets/svg/shareIcon.svg';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import '@splidejs/react-splide/css';
import { Splide, SplideTrack, SplideSlide } from '@splidejs/react-splide';


const Listing = () => {

  const [ listing, setListing ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ sharedLinkCopied, setSharedLinkCopied ] = useState(false);
  
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();


  useEffect(() => {
    const fetchListing = async () =>{
      const docRef = doc(db, 'listing', params.listingId);
      const docSnap = await getDoc(docRef);

      if(docSnap.exists()){
        setListing(docSnap.data());
        console.log(docSnap.data());
        setLoading(false)
      }

    }

    fetchListing()
  }, [navigate, params.listingId]);

  if(loading){
    return (
      <div  className='loadingSpinnerContainer'>
        <GridLoader size={40} width={30} margin={10} speedMultiplier={2} color='#36d7b7' />
      </div>
    )
  }
  const options = {
    type         : 'loop',
    gap          : '1rem',
    autoplay     : true,
    pauseOnHover : false,
    resetProgress: false,
    height       : '15rem',
  };

  return (
    <main>
      {/* @todo- slider */}
      <Splide
      options={ options }
      aria-labelledby="autoplay-example-heading"
      hasTrack={ false }
      >
        <SplideTrack>
          {listing.imgUrls.map((url, index) => (
              <SplideSlide key={index}>
                <div className='swiperSlideDiv'>
                  <img className='swiperSlideImg' src={listing.imgUrls[index]} alt='listing-living'/>
                </div>
              </SplideSlide>
            ))}
        </SplideTrack>
      </Splide>

      <div className="shareIconDiv" onClick={() => {
        navigator.clipboard.writeText(window.location.href);
        setSharedLinkCopied(true);

        setTimeout(() =>{
          setSharedLinkCopied(false);
        }, 2000);
      }}>
        <img src={ShareIcon} alt="share-icon" />
      </div>

      {sharedLinkCopied && <p className='linkCopied'>Link Copied</p>}

      <div className="listingDetails">
        <p className="listingName">
          {listing.name} - L.E {listing.offer ? listing.discountedPrice : listing.regularPrice}
        </p>
        <p className="listingLocation">{listing.location}</p>
        <p className="listingType">For {listing.type === 'rent'? 'Rent': 'Sale'}</p>
        {
          listing.offer && (
            <p className="discountPrice">
              L.E {listing.regularPrice - listing.discountedPrice} discount
            </p>
          )
        }

        <ul className="listingDetailsList">
          <li>
            {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms` : '1 Bedroom'}
          </li>
          <li>
            {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms` : '1 Bathroom'}
          </li>
          <li>{listing.parking && 'Parking spot'}</li>
          <li>{listing.furnished && 'Furnished'}</li>
        </ul>

        <p className='listingLocationTitle'>Location</p>
        {/* @todo - Map */}

        <div className='leafletContainer'>
          <MapContainer style={{height: '100%', width: '100%'}} center={[listing.geoLocation.lat, listing.geoLocation.lng]} zoom={13} scrollWheelZoom={false}>
            
            <TileLayer  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png' />

            
            <Marker
              position={[listing.geoLocation.lat, listing.geoLocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker>
          </MapContainer>
        </div>

        {auth.currentUser?.uid !== listing.userRef && (
          <Link
            to={`/contact/${listing.userRef}?listingName=${listing.name}`}
            className='primaryButton'
          >
            Contact Landlord
          </Link>
        )}

      </div>
    </main>
  )
}

export default Listing
