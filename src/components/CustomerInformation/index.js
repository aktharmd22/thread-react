import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import Navbar from '../Navbar';
import MenuBar from '../MenuBar';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { IoIosAdd } from "react-icons/io";
import InformationDeletePopup from '../InformationDeletePopup';
import TicketsSection from '../TicketsSection';
import PendingTickets from '../PendingTickets'
import Renewal from '../Renewal';
import EmailAutomation from '../EmailAutomation';


import NotePanel from '../NotePanel';

import "./customerInformation.css"
import { eventWrapper } from '@testing-library/user-event/dist/utils';
// Get the current URL

const websiteLink='https://crmsnodebackend.smartyuppies.com/'
const jwtToken = Cookies.get('jwt_token')
const is_admin = Cookies.get('isa')

const keyMapping = {
  name: "Name",
  email_address: "Email Address",
  company_name: "Company Name",
  phone_number: "Phone Number",
  service_name: "Service Name",
  date_of_purchase: "Date of Purchase",
  expiry_date: "Expiry Date",
  purchase_value: "Purchase Value",
  gst_number: "GST Number",
  price_with_gst: "Price With GST",
  alternate_phone_number: "Alternate Phone Number",
  alternate_email_address: "Alternate Email Address"
  // Add more key-value pairs as needed
};


function transformKeys(originalObject) {
  let transformedObject = {};
  for (let key in originalObject) {
    if (keyMapping.hasOwnProperty(key)) {
      transformedObject[keyMapping[key]] = originalObject[key];
    } else {
      transformedObject[key] = originalObject[key];
    }
  }
  return transformedObject;
}

const CustomerInformation = (props) => {

  const [customerData, setCustomerData] = useState({})
  const [customerServices, setCustomerServices] = useState([])
  const [remainingDay, setRemainingday] = useState({})
  const [activeTab, setActiveTab] = useState("Purchase")
  const [showDeleteWarning, setshowDeleteWarning] = useState(false)
  const [toShowTicketSection, setToShowTicketSection] = useState(false)
  const [updatePendingTickets,setUpdatePendingTickets]=useState(false)

  let { id } = useParams();
  let expDate


  useEffect(() => {
    const extractCustomerIdFromUrl = async () => {
      const url = `${websiteLink}getcustomerinformation/${id}`;

      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      };

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const updatedData = transformKeys(data[0]);
        setCustomerData(updatedData);
      } catch (error) {
        console.error('Error fetching customer information:', error);
        // Handle error state or display a user-friendly message
      }
    };

    extractCustomerIdFromUrl();
  }, [id, jwtToken]);


  useEffect(() => {
    const fetchData = async () => {
      const url = `${websiteLink}getSingleCustomerServices/${id}`
      const options = {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
        method: 'GET',
      }

      const response = await fetch(url, options)
      const data = await response.json()
      const convertData = data.map((each) => ({
        id: each.id,
        customer_services_id: each.customer_services_id,
        service_name: each.service_name,
        purchase_value: each.purchase_value,
        price_with_gst: each.price_with_gst,
        date_of_purchase: each.date_of_purchase,
        expiry_date: each.expiry_date,
      }))
      const updatedData = convertData.map(each => transformKeys(each))
      setCustomerServices(updatedData)
    }
    fetchData()
  }, [remainingDay])

  const onDeleteServiceList = async event => {
    const listId = (event.target.id)
    const url = `${websiteLink}deleteCustomerEachService/${listId}`
    const options = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'DELETE'
    };
    const response = await fetch(url, options)
    if (response.ok) {
      setRemainingday(listId)
    }
  }

  const onhandlingNewTicket=()=>{
    setUpdatePendingTickets(prev=>!prev)
  }



  const customerServiceList = each => (
    <li className='service-list'>
      {Object.keys(each).map(key => {
        if (key === "Date of Purchase" || key === "Expiry Date") {
          const datetimeString = each[key];

          const datePart = datetimeString.split('T')[0];

          const dateObj = new Date(datePart);

          const day = dateObj.getDate() + 1;
          const month = dateObj.getMonth() + 1; // Months are zero-based
          const year = dateObj.getFullYear();

          const formattedDay = day < 10 ? `0${day}` : day;
          const formattedMonth = month < 10 ? `0${month}` : month;

          // Formatted date string in DD-MM-YYYY format
          const formattedDate = `${formattedDay}-${formattedMonth}-${year}`;

          //console.log(formattedDate)
          let expiryDate = new Date(datePart);

          let currentDate = new Date();

          // Calculate remaining days
          let remainingDays = Math.ceil((expiryDate - currentDate) / (1000 * 60 * 60 * 24));
          expDate = remainingDays + 1
          //console.log(expDate)

          return (
            <div key={key} className='popup-li'>
              <p className='popup-key'>{key}</p>
              <p className='popup-value'>{formattedDate}</p>
            </div>
          )

        } else if (key === "id" || key === "customer_services_id") {
          return null
        }
        else {
          return (
            <div key={key} className='popup-li '>
              <p className='popup-key'>{key}</p>
              <p className='popup-value'>{each[key]}</p>
            </div>
          )
        }
      })}
      {expDate > 0 ? <p className='remaining-days'>{`Remaining Days ${expDate}`}</p> : <p className='expired'>Expired</p>}
      <div className='updation-container'>
        <Link to={`/updateServiceList/${customerData.id}/${each.customer_services_id}`}><button className='updation-container-button' id={each.customer_services_id}>update</button></Link>
        {is_admin==="1"?<button className='updation-container-button' onClick={onDeleteServiceList} id={each.customer_services_id}>delete</button>:""}
      </div>
    </li>
  )

  const onChangeActiveTab = event => {
    setActiveTab(event.target.id)
  }

  const customerInformationDelete = () => {
    setshowDeleteWarning(!showDeleteWarning)
  }

  const onCreateTicket = () => {
    setToShowTicketSection(!toShowTicketSection)
  }
  

  return (
    <div className='total-cont'>
      <Navbar />
      <div className='home-container'>
        <MenuBar />
        <div className='customer-content-container'>
          <div className='customer-information-update-section'>
            <Link to={`/UpdateCustomerDetails/${customerData.id}`}><button className='customer-information-update-button'>Update</button></Link>
            {is_admin==="1"?<button className='customer-information-update-button' onClick={customerInformationDelete}>Delete</button>:""}
          </div>
          <ul className='customer-information-section'>
            <h2 className='customer-information-heading'>Customer Details</h2>
            {Object.keys(customerData).map(key => (
              <li key={key} className='popup-li'>
                <p className='popup-key'>{key}</p>
                <p className='popup-value'>{customerData[key]}</p>
              </li>
            ))}
          </ul>
          <div className='multitask-panel'>
            <div className='multitask-button-container'>
              <div>
                <button className={`multitask-button ${activeTab==='Purchase'?"actived-button" : ""} `} id="Purchase" onClick={onChangeActiveTab} >Purchased Items</button>
                <button className={`multitask-button ${activeTab==='Pending'?"actived-button" : ""} `} id="Pending" onClick={onChangeActiveTab} >Cases</button>
                <button className={`multitask-button ${activeTab==='Renewel'?"actived-button" : ""} `} id="Renewal" onClick={onChangeActiveTab} >Renewal</button>
                <button className={`multitask-button ${activeTab==='note'?"actived-button" : ""} `} id="note" onClick={onChangeActiveTab} >Note</button>
                <button className={`multitask-button ${activeTab==='email'?"actived-button" : ""} `} id="email" onClick={onChangeActiveTab} >Email</button>
              </div>
              <Link to={`/addcustomerservices/${id}`}><button className='add-service-button'><IoIosAdd className='add-service-button-icon' /><p>Add Service</p></button></Link>
            </div>

            {activeTab === "Purchase" ?
              <ul className={`serviceList-container `}>
                {customerServices.map(each => customerServiceList(each))}
              </ul> : ""
            }
            {activeTab === "Pending" ? <div className=''><PendingTickets  updatePendingTickets={updatePendingTickets} customerId={id} /></div> : ""}
            {activeTab === "note" ? <div className='note-panel'><NotePanel customerId={id} /></div> : ""}
            {activeTab==="Renewal"?<Renewal customerId={id}/>:"" }
            {activeTab==="email"?<EmailAutomation customerId={id} customerEmail={customerData["Email Address"]}/>:"" }
          </div>
          <button onClick={onCreateTicket}  className='create-ticket-button'>Create Tickets</button>
          {toShowTicketSection === true ? <TicketsSection customerId={customerData.id} onhandlingNewTicket={onhandlingNewTicket} setToShowTicketSection={setToShowTicketSection} /> : ""}
        </div>


      </div>{showDeleteWarning === true ? <InformationDeletePopup customerId={customerData.id} setshowDeleteWarning={setshowDeleteWarning} /> : ""}
    </div>
  );
}
export default CustomerInformation