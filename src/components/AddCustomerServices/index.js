import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import Navbar from '../Navbar';
import MenuBar from '../MenuBar';
import { useParams, useNavigate } from 'react-router-dom';

import "./AddCustomerServices.css"

const jwtToken = Cookies.get('jwt_token')
const websiteLink='https://crmsnodebackend.smartyuppies.com/'

const AddCustomerServices = () => {
    let { id } = useParams();
    const navigate=useNavigate()
    const [customerData, setCustomerData] = useState({})
    const [serviceList, setServiceList] = useState([])
    const [selectedOption, setSelectedOption] = useState()
    const [purchaseDate, setPurchaseDate] = useState()
    const [expiryDate, setExpiryDate] = useState()
    const [purchaseValue, setPurchaseValue] = useState(0)
    const [gstPercentage, setGstPercentage] = useState(0)
    const [priceWithGst,setPriceWithGst]=useState()
    const [showPopup,setShowPopup]=useState(false)
    const [newService,setNewService]=useState("")

    useEffect(() => {
        const fetchData = async () => {
            const url = `${websiteLink}getcustomerinformation/${id}`
            const options = {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'GET',
            };
            const response = await fetch(url, options)
            if (response.ok) {
                const data = await response.json()
                setCustomerData(data[0])
            }
        }
        fetchData()
    }, [])
    useEffect(() => {
        const fetchData = async () => {
            const url = `${websiteLink}getserviceList`
            const options = {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'GET',
            };
            const response = await fetch(url, options)
            if (response.ok) {
                const data = await response.json()
                console.log(data)
                setServiceList(data)
                setSelectedOption(data[0].service_name)
            }
        }
        fetchData()
    }, [showPopup])

    useEffect(()=>{
        const gst = (purchaseValue * parseFloat(gstPercentage)) / 100;
        const total=parseFloat(purchaseValue)+gst
        setPriceWithGst(total.toFixed(2))
    },[gstPercentage,purchaseValue])

    const submittingDetails = async (event) => {
        event.preventDefault()
        const customerDetails = {
            ...customerData,
            service_name: selectedOption,
            expiry_date: expiryDate,
            date_of_purchase: purchaseDate,
            purchase_value: purchaseValue,
            price_with_gst:priceWithGst
        }
        console.log(customerData)
        delete customerDetails.id;
        if (purchaseValue === undefined || expiryDate === undefined || purchaseDate === undefined || selectedOption === undefined) {
            alert("Enter All Details")
        } else {
            const url = `${websiteLink}insertingCustomerDetails`
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'POST',
                body: JSON.stringify(customerDetails),
            };
            const response = await fetch(url, options)
            if (response.ok === true) {
                navigate(`/customer-information/${customerData.id}`)
            }else{
                alert("Cannot insert the customer details")
            }
        }
    }

    const onChangePurchaseValue=(event) => {
        setPurchaseValue(event.target.value)
        setPriceWithGst(event.target.value)
    }

    const onChangeGst=event=>{
        setGstPercentage(parseFloat(event.target.value))
    }

    const addService= async()=>{
        if(newService!=="" && newService!==" "){
        const url=`${websiteLink}insertingServiceList`
        const serviceName={service_name:newService}
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            method: 'POST',
            body: JSON.stringify(serviceName),
        }; 
        const response= await fetch(url,options)
        if(response.ok!==true){
            alert("Service Already Exist")
        }
        setNewService("")
        setShowPopup(!showPopup)
    }else{
        alert("Empty Values Not Allow")
    }

    }

    return (
        <div>
            <Navbar />
            <div className='home-container'>
                <MenuBar />
                <div className='add-customer-container'>
                    <h2>Add New Service to <span className='customer-name'>{customerData.name}</span></h2>
                    <div className='form-details-sections'>
                    <form onSubmit={submittingDetails} className='add-customer-form'>
                        <div className="add-customer-form-item-container">
                            <p className="add-customer-form-items he">Name</p>
                            <p className='add-customer-form-item'>{customerData.name}</p>
                        </div>
                        <div className="add-customer-form-item-container">
                            <p className="add-customer-form-items he">Email Address</p>
                            <p className="add-customer-form-items">{customerData.email_address}</p>
                        </div>
                        <div className="add-customer-form-item-container">
                            <p className="add-customer-form-items he">Phone Number</p>
                            <p className="add-customer-form-items">{customerData.phone_number}</p>
                        </div>
                        <div className="add-customer-form-item-container">
                            <p className="add-customer-form-items he">Company Name</p>
                            <p className="add-customer-form-items">{customerData.company_name}</p>
                        </div>
                        <div className="add-customer-form-item-container">
                            <p className="add-customer-form-items he">GST Number</p>
                            <p className="add-customer-form-items">{customerData.gst_number}</p>
                        </div>
                        <div className="add-customer-form-item-container">
                            <label htmlFor='sel' className="add-customer-form-items label">Service Name</label>
                            <select id="sel" className='add-customer-select' value={selectedOption} onChange={(event) => setSelectedOption(event.target.value)}>
                                {serviceList.map(each => (
                                    <option value={each.service_name}>{each.service_name}</option>
                                ))}
                            </select>
                            <button className='service-add-button' type='button' onClick={()=>setShowPopup(!showPopup)}>Add New Service</button>
                        </div>
                        <div className="add-customer-form-item-container">
                            <label className="add-customer-form-items  label ">Purchase Value</label>
                            <input className="add-customer-purchase-value" type='number' onChange={onChangePurchaseValue} />
                        </div>
                        <div className="add-customer-form-item-container">
                            <label className="add-customer-form-items  label ">GST Percentage</label>
                            <input className="add-customer-purchase-value" type='text' onChange={onChangeGst}  />
                        </div>
                        <div className="add-customer-form-item-container">
                            <label className="add-customer-form-items  label" htmlFor="">Date of Purchase</label>
                            <input className='add-customer-form-date' type="date" onChange={(event) => setPurchaseDate(event.target.value)} />
                        </div>
                        <div className="add-customer-form-item-container">
                            <label className="add-customer-form-items  label" htmlFor="">Expiry Date</label>
                            <input className='add-customer-form-date' type="date" onChange={(event) => setExpiryDate(event.target.value)} />
                        </div>
                        <div className="add-customer-form-item-container">
                            <p className="add-customer-form-items he">Price With GST</p>
                            <p className="add-customer-form-items he">{priceWithGst}</p>
                        </div>
                        <button type='submit' className='add-customer-submit'>Submit</button>
                    </form>
                    {showPopup?<div className='addservice-section'>
                        <input type="text" className='service-input' placeholder="Add New Service..." value={newService} onChange={(event)=>setNewService(event.target.value)} />
                        <button className='popup-add-service-button'  onClick={addService}>Add Service</button>
                    </div>:""}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
export default AddCustomerServices