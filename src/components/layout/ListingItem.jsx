import React from 'react';
import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../../assets/svg/deleteIcon.svg';
import bedIcon from '../../assets/svg/bedIcon.svg';
import bathtubIcon from '../../assets/svg/bathtubIcon.svg';


const ListingItem = ({listing, id, onDelete}) => {
  return (
    <li className='categoryListing'>
      <Link className='categoryListingLink' to={`/category/${listing.type}/${id}`}>
        <img src={listing.imgUrls[0]} alt='listing-property' className='categoryListingImg' />
        <div className="categoryListingDetails">
            <p className="categoryListingLocation">
                {listing.location}
            </p>
            <p className="categoryListingName">
                {listing.name}
            </p>
            <p className="categoryListingPrice">
            L.E {listing.offer ? listing.discountedPrice : listing.regularPrice }
                {listing.type === 'rent' && ' / Month'}
            </p>
            <div className="categoryListingInfoDiv">
                <img src={bedIcon} alt="bedroom" />
                <p className="categoryListingInfoText">
                    {listing.bedrooms > 1 ? `${listing.bedrooms} Bedrooms`: '1 Bedroom'}
                </p>
                <img src={bathtubIcon} alt="bath" />
                <p className="categoryListingInfoText">
                {listing.bathrooms > 1 ? `${listing.bathrooms} Bathrooms`: '1 Bathroom'}
                </p>
            </div>
        </div>
      </Link>

      {onDelete && 
        (<DeleteIcon className='removeIcon' fill='rgb(231, 76, 60)' width='34px' height='34px' onClick={() => onDelete(listing.id, listing.name)}/>)
      }
    </li>
  )
}

export default ListingItem
