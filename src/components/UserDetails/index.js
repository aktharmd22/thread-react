import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import Navbar from '../Navbar';
import MenuBar from '../MenuBar';
import { Link } from 'react-router-dom';

import './index.css'
const jwtToken = Cookies.get("jwt_token")

const websiteLink='https://crmsnodebackend.smartyuppies.com/'

const UserDetails = () => {
    const [userData, setUserData] = useState([])
    const [userSearch, setUserSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const url = `${websiteLink}admin/getAgentList`
            const options = {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'GET',
            };
            const response = await fetch(url, options)
            if (response.ok) {
                const data = await response.json()
                setUserData(data)
                console.log(data)
            }
        }
        fetchData()
    }, [])

    const filteredCustomers = userData.filter(item =>
        item.name.toLowerCase().includes(userSearch.toLowerCase()) || item.phone_number.toString().includes(userSearch) || item.email_address.toLowerCase().includes(userSearch.toLowerCase()));

    

    const customerList = filteredCustomers.map(each => (
        <li className='customer-list' key={each.id} >
            <Link to="" className='Link'>
                <p className='customer-list-item'>{`Name : ${each.name}`}</p>
                <p className='customer-list-item'>{`Email Address :  ${each.email_address}`}</p>
                <p className='customer-list-item'>{`Phone Number  :  ${each.phone_number}`}</p>
                <p className='customer-list-item'>{`Designation  :  ${each.designation}`}</p>
                <p className='customer-list-item'>{`Gender  :  ${each.gender}`}</p>
            </Link>
        </li>
    ));

    return (
        <div>
            <Navbar />
            <div className='home-container'>
                <MenuBar />
                <div className='customer-container'>
                    <h1>All Users</h1>
                    <div className='search-addcustomer-section'>
                        <div className='customer-search-container'>
                        {/* <FaSearch /> */}
                        <input value={userSearch} placeholder={`Total Customer : `} type="search" className='customer-search' onChange={(event) => setUserSearch(event.target.value)} />
                    </div>
                    <Link className='Link' to="/Add-newuser"><button className='customerDetails-add-customer-button'>Add User</button></Link>
                    </div>
                    
                    <ul className='customer-list-container'>
                        {userData.length > 0 ? customerList : <li>No customers found</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default UserDetails