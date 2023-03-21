import React from 'react';
import { Link } from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';
import Slider from '../components/layout/Slider';

const Explore = () => {
  return (
    <div className='explore'>
      <header>
        <p className="pageHeader">
          Explore
        </p>
      </header>

      <main>
        <Slider/>

        <p className="exploreCategoryHeading">
          Categories
        </p>
        <div className="exploreCategories">
          <div>
            <Link to='/category/rent'>
              <img src={rentCategoryImage} alt="rent" className='exploreCategoryImg' />
            </Link>
            <p className="exploreCategoryName">
              Places for Rent
            </p>
          </div>
          <div>
            <Link to='/category/sale'>
              <img src={sellCategoryImage} alt="sell" className='exploreCategoryImg' />
            </Link>
            <p className="exploreCategoryName">
              Places for Sale
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Explore
