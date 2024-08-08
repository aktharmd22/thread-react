import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../Navbar';
import MenuBar from '../MenuBar'

import "./profilePageIndex.css"

const websiteLink='https://crmsnodebackend.smartyuppies.com/'
const ProfilePage = () => {
  const [data, setData] = useState({})

  const jwtToken = Cookies.get("jwt_token")
  const email = Cookies.get("email_address")
  //const usersName=data.name.charAt(0).toUpperCase() + data.name.slice(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const options = {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          method: 'GET',
        }
        const url = `${websiteLink}getUserByEmail/${email}`
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setData(result[0])
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [jwtToken, email]);

  const profildetailsContainer = () => (
    <div className='profile-container-section'>
      <img src="" />
      <h1 className='profile-container-section-name'>{data.name}</h1>
      <p className='profile-container-section-designation'>{data.designation}</p>
      <Link to="/editProfile"><button className='profile-container-section-edit-button'>Edit Profile</button></Link>
    </div>
  )

  const profileDetailsTable = () => (
    <div className="profile-details-table">
      <div className='profile-details-row'>
        <p className='profile-details-row-items'>Full Name</p>
        <p className='profile-details-row-items-1'>{data.name}</p>
      </div>
      <hr/>
      <div className='profile-details-row'>
        <p className='profile-details-row-items'>Email Address</p>
        <p className='profile-details-row-items-1'>{data.email_address}</p>
      </div>
      <hr/>
      <div className='profile-details-row'>
        <p className='profile-details-row-items'>Phone Number</p>
        <p className='profile-details-row-items-1'>{data.phone_number}</p>
      </div>
      <hr/>
      <div className='profile-details-row'>
        <p className='profile-details-row-items'>Gender</p>
        <p className='profile-details-row-items-1'>{data.gender}</p>
      </div>
      <hr/>
      <div className='profile-details-row'>
        <p className='profile-details-row-items'>Designation</p>
        <p className='profile-details-row-items-1'>{data.designation}</p>
      </div>
    </div>
  )


  return (
    <div>
      <Navbar />
      <div className='home-container'>
        <MenuBar />
        <div className='home-content-section'>

          {profildetailsContainer()}
          {profileDetailsTable()}
        </div>
      </div>
    </div>
  )
}
export default ProfilePage