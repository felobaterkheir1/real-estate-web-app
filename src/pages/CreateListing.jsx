import React, {useState, useEffect, useRef} from 'react';
import {GridLoader} from 'react-spinners'
import {getAuth, onAuthStateChanged} from 'firebase/auth';
import {toast} from 'react-toastify';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {addDoc, collection,  serverTimestamp} from 'firebase/firestore'
import {db} from '../firebase.config';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';

const CreateListing = () => {

    const [loading, setLoading] = useState(false);
    const [geoLocationEnabled, setGeoLocationEnabled] = useState(true);
    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        offer: false,
        furnished: false,
        address: '',
        regularPrice: 0,
        discountedPrice: 0,
        images: {},
        latitude: 0,
        longitude: 0
    });

    const {
      type,
      name,
      bedrooms,
      bathrooms,
      parking,
      furnished,
      address,
      offer,
      regularPrice,
      discountedPrice,
      images,
      latitude,
      longitude,
    } = formData
    const auth = getAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);

    useEffect(() => {
      if(isMounted){
        onAuthStateChanged(auth, (user) => {
          if(user){
            setFormData({...formData, userRef: user.uid});
          }else{
            navigate('/signin');
          }
        })
      }
      return () => {
        isMounted.current = false;
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMounted])

    const handleSubmit = async (e) =>{
      e.preventDefault();
      setLoading(true)

      if(discountedPrice >= regularPrice){
        setLoading(false);
        toast.error('The discounted price must not be more than the regular price');
        return
      }

      if(images.length > 6){
        setLoading(false);
        toast.error('Max 6 images');
        return
      }

      let geoLocation = {};
      let location

      if(geoLocationEnabled){
        const response = await fetch(`
        https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GEOCODING_API_KEY} 
        `);
        const data = await response.json();
        
        geoLocation.lat = data.results[0]?.geometry.location.lat ?? 0;
        geoLocation.lng = data.results[0]?.geometry.location.lng ?? 0;

        location = data.status === 'ZERO_RESULTS' ? undefined : data.results[0]?.formatted_address;

        if(location === undefined || location.includes('undefined')){
          setLoading(false);
          toast.error('please enter the right address');
          return;
        } 

      }else{
        geoLocation.lat = latitude;
        geoLocation.lng = longitude;
        // location = address;
      }

      // upload the images to the firebase
      const ImageStore = async (image) => {
        return new Promise((resolve, reject) =>{
          const storage = getStorage();
          const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

          const storageRef = ref(storage,'images/' + fileName);
          const uploadTask = uploadBytesResumable(storageRef, image);

          uploadTask.on('state_changed', 
              (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                  case 'paused':
                    console.log('Upload is paused');
                    break;
                  case 'running':
                    console.log('Upload is running');
                    break;
                }
              }, 
              (error) => {
                // Handle unsuccessful uploads
                reject(error)
              }, 
              () => {
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                 resolve(downloadURL);
                });
              }
            );
        })
      }

      const imgUrls = await Promise.all(
        [...images].map((image) => ImageStore(image))
      ).catch(() => {
        setLoading(false);
        toast.error("Images couldn't be uploaded");
        return;
      })

      const formDataCopy = {
        ...formData,
        imgUrls,
        geoLocation,
        timestamp: serverTimestamp()
      }

      formDataCopy.location = location;
      delete formDataCopy.images;
      delete formDataCopy.address;
      delete formDataCopy.latitude;
      delete formDataCopy.longitude;
      !formDataCopy.offer && delete formDataCopy.discountedPrice;
      // location && (formDataCopy.location = location);

      const docRef = addDoc(collection(db, 'listing'), formDataCopy);
      setLoading(false);
      toast.success('listing is created')
      navigate(`/category/${formDataCopy.type}/${(await docRef).id}`);
    }

    const onMutate = (e) => {
      let boolean = null;
      if(e.target.value === 'true'){
        boolean = true; 
      }
      if(e.target.value === 'false'){
        boolean = false;
      }

      // Files
      if(e.target.files){
        setFormData((prevState) =>({
          ...prevState,
          images: e.target.files
        }));
      }

      // Text, numbers, and Booleans
      if(!e.target.files){
        setFormData((prevState)=> ({
          ...prevState,
          [e.target.id]: boolean ?? e.target.value
        }))
      } 
    }
    if(loading){
      return <div  className='loadingSpinnerContainer'>
      <GridLoader size={40} width={30} margin={10} speedMultiplier={2} color='#36d7b7' />
    </div>
    }
  return (
    <div className='profile'>
      <header>
        <p className="pageHeader">
          Create a Listing
        </p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <label className='formLabel'>Sell / Rent</label>
          <div className="formButtons">
            <button className={type === 'sale' ? 'formButtonActive' : 'formButton'} id='type' value='sale' onClick={onMutate}>
              Sell
            </button>
            <button className={type === 'rent' ? 'formButtonActive' : 'formButton'} id='type' value='rent' onClick={onMutate}>
              Rent
            </button>
          </div>

          <label className='formLabel'>Name</label>
          <input type="text" className='formInputName' id='name' value={name} onChange={onMutate} maxLength='32' minLength='10' required />
        

          <div className="formRooms flex">
            <div>
              <label className='formLabel'>Bedrooms</label>
              <input type="number" className='formInputSmall' id='bedrooms' value={bedrooms} onChange={onMutate} maxLength='50' minLength='1' required/>
            </div>
            <div>
              <label className='formLabel'>Bathrooms</label>
              <input type="number" className='formInputSmall' id='bathrooms' value={bathrooms} onChange={onMutate} maxLength='50' minLength='1' required/>
            </div>
          </div>

          <label className='formLabel'>Parking spot</label>
          <div className='formButtons'>
            <button
              className={
                parking ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={true}
              onClick={onMutate}
            >
              Yes
            </button>
            <button
              className={
                !parking && parking !== null ? 'formButtonActive' : 'formButton'
              }
              type='button'
              id='parking'
              value={false}
              onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Furnished</label>
          <div className="formButtons">
            <button className={furnished ? 'formButtonActive' : 'formButton' }
            type='button'
            id='furnished'
            value={true}
            onClick={onMutate}
            >
              yes
            </button>
            <button
            className={!furnished && furnished !== null ? 'formButtonActive' : 'formButton'}
            type='button'
            id='furnished'
            value={false}
            onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className='formLabel'>Address</label>
          <textarea className='formInputAddress'
          id='address'
          type='text'
          value={address}
          onChange={onMutate}
          required
          />
    
        {
          !geoLocationEnabled && (
            <div className="formLatLng flex">
              <div>
                <label className="formLabel">Latitude</label>
                <input type="number"  
                className='formInputSmall'
                id='latitude'
                value={latitude}
                onChange={onMutate}
                required
                />
              </div>
              <div>
                <label className="formLabel">Longitude</label>
                <input type="number"  
                className='formInputSmall'
                id='longitude'
                value={longitude}
                onChange={onMutate}
                required
                />
              </div>
            </div>
          )
        }

        <label className='formLabel'>Offers</label>
          <div className="formButtons">
            <button className={offer ? 'formButtonActive' : 'formButton' }
            type='button'
            id='offer'
            value={true}
            onClick={onMutate}
            >
              yes
            </button>
            <button
            className={!offer && offer !== null ? 'formButtonActive' : 'formButton'}
            type='button'
            id='offer'
            value={false}
            onClick={onMutate}
            >
              No
            </button>
          </div>

          <label className="formLabel">Regular Price</label>
          <div className="formPriceDiv">
            <input type="number"
            className='formInputSmall'
            id='regularPrice'
            value={regularPrice}
            min='50'
            max='75000000'
            onChange={onMutate}
            required
            />
            {
              formData.type === 'rent' && (
                <p className='formPriceText'>L.E / Month</p>
              )
            }
          </div>

          {
            offer && (
          <>
            <label className="formLabel">Discounted Price</label>
            <div className="formPriceDiv">
              <input type="number"
              className='formInputSmall'
              id='discountedPrice'
              value={discountedPrice}
              min='50'
              max='75000000'
              onChange={onMutate}
              required
              />
              {
                type === 'rent' && (
                  <p className='formPriceText'>L.E / Month</p>
                )
              }
            </div>
          </>
            )
          }

          <label className="formLabel">Images</label>
          <p className="imagesInfo">The First Image will be the cover (max 6).</p>
          <input type="file"
          className='formInputFile'
          id='images'
          onChange={onMutate}
          max='6'
          accept='.jpg,.png,.jpeg'
          multiple
          required
          />

          <button type='submit' className="primaryButton createListingButton">
            Create Listing
          </button>
        </form>
    </main>
    </div>
  )
}

export default CreateListing
