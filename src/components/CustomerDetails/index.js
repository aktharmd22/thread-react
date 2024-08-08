import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import Navbar from '../Navbar';
import MenuBar from '../MenuBar';
import "./customerIndex.css";
import { Link } from 'react-router-dom';
import { FaSearch } from "react-icons/fa";

const websiteLink='https://crmsnodebackend.smartyuppies.com/'

const CustomerDetails = () => {
    const jwtToken = Cookies.get("jwt_token");
    const userId=Cookies.get("idu")
    const [customerData, setCustomerData] = useState([]);
    const [customerSearch, setCustomerSearch] = useState("");
    const [totalCustomerCount,setTotalCustomerCount]=useState("")

    useEffect(() => {
        const fetchData = async () => {
            try {
                const url = `${websiteLink}customerDetails`;
                const options = {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                    method: 'GET',
                };
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error('Failed to fetch customer data');
                }
                const data = await response.json();
                setCustomerData(data[0]);
                setTotalCustomerCount(data[1][0].total_cutomers)
            } catch (error) {
                console.error('Error fetching customer data:', error);
                // Handle error state or retry logic
            }
        };
        fetchData();
    }, []);

    const filteredCustomers = customerData.filter(item =>
        item.name.toLowerCase().includes(customerSearch.toLowerCase()) || item.phone_number.toString().includes(customerSearch) || item.email_address.toLowerCase().includes(customerSearch.toLowerCase()));

    const onAddClickedList =async (id) => {
        const details= {
            customer_id:id,
            user_id:userId
        }
        const url=`${websiteLink}insert-visitedtime`
        const option={
            headers:{
                "Content-Type" :"Application/json",
                Authorization:`Bearer ${jwtToken}`
            },
            method:"POST",
            body:JSON.stringify(details)
        }
        const response= await fetch(url,option)
        console.log(response)
        if(response.ok){
            console.log("updated")
        }
        
    }

    const customerList = filteredCustomers.map(each => (
        <li className='customer-list' key={each.id} onClick={()=>onAddClickedList(each.id)}>
            <Link className='Link' to={`/customer-information/${each.id}`}>
                <div className='customer-list-item'><p>Name</p><p>: {each.name}</p></div>
                <div className='customer-list-item'><p>Email</p><p className='customer-list-p'>: {each.email_address}</p></div>
                <div className='customer-list-item'><p>Phone Number</p><p>: {each.phone_number}</p></div>
                <div className='customer-list-item'><p>Company Name</p><p>: {each.company_name}</p></div>
            </Link>
        </li>
    ));

    return (
        <div>
            <Navbar />
            <div className='home-container'>
                <MenuBar />
                <div className='customer-container'>
                    {/* <h1>All Customers</h1> */}
                    <div className='search-addcustomer-section'>
                        <div className='customer-search-container'>
                        <FaSearch />
                        <input value={customerSearch} placeholder={`Total Customer : ${totalCustomerCount}`} type="search" className='customer-search' onChange={(event) => setCustomerSearch(event.target.value)} />
                    </div>
                    <Link to="/Addcustomerdetails"><button className='customerDetails-add-customer-button'>Add Customer</button></Link>
                    </div>
                    
                    <ul className='customer-list-container'>
                        {customerList.length > 0 ? customerList : <li>No customers found</li>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CustomerDetails;
