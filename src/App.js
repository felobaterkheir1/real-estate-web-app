// General Requirements and Declarations
import React, { Fragment } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Explore from './pages/Explore';
import Category from "./pages/Category";
import Listing from "./pages/Listing";
import Offers from './pages/Offers';
import Profiles from './pages/Profiles';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgetPassword from './pages/ForgetPassword';
import Navbar from "./components/layout/Navbar";
import PrivateRoute from "./components/layout/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import Contact from "./pages/Contact";

function App() {
  return (
    <>
      <Router>
        <Fragment>
          <div className="App">
            <Routes>
              <Route exact path='/' element={<Explore />} />
              <Route path='/offers' element={<Offers />} />
              <Route path="/category/:categoryName" element={<Category />} />
              <Route path="/category/:categoryName/:listingId" element={<Listing/>} />
              <Route path="/contact/:landlordId" element={<Contact />} />
              <Route path='/signin' element={<SignIn />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/profiles' element={<PrivateRoute/>}>
                <Route path='/profiles' element={<Profiles />} />
              </Route>
              <Route path='/forgetpassword' element={<ForgetPassword />} />
              <Route path="/create-listing" element={<CreateListing />} />
            </Routes>
            <Navbar />
          </div>
        </Fragment>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
