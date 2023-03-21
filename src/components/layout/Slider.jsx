import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../../firebase.config'
import '@splidejs/react-splide/css';
import { Splide, SplideTrack, SplideSlide } from '@splidejs/react-splide';



function Slider() {
  const [loading, setLoading] = useState(true)
  const [listings, setListings] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listing')
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
      const querySnap = await getDocs(q)

      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listings)
      setLoading(false);
      console.log(listings);
    }

    fetchListings()
  }, [])

  if (loading) {
    return <h1>Loading...</h1>
  }

  if (listings.length === 0) {
    return <></>
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
    listings && (
      <>
        <p className='exploreHeading'>Recommended</p>

            <Splide
            options={ options }
            aria-labelledby="autoplay-example-heading"
            hasTrack={ false }
            >
                <SplideTrack>
                    {listings.map(({ data, id }) => (
                        <SplideSlide  key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                            <div className='swiperSlideDiv'>
                                <img className='swiperSlideImg' src={data.imgUrls[0]} alt='listing-living'/>
                                <p className='swiperSlideText'>{data.name}</p>
                                <p className='swiperSlidePrice'>
                                ${data.discountedPrice ?? data.regularPrice}{' '}
                                {data.type === 'rent' && '/ month'}
                                </p>
                            </div>
                        </SplideSlide>
                        ))}
                </SplideTrack>
            </Splide>
      </>
    )
  )
}

export default Slider