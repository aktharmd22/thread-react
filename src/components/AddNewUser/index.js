import Navbar from '../Navbar';
import MenuBar from '../MenuBar';
import Cookies from "js-cookie";
import React, { useState, useEffect } from 'react';
import "./index.css"

const websiteLink='https://crmsnodebackend.smartyuppies.com/'
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
    alternate_email_address: "Alternate Email Address",
    password: "Password",
    designation: "Designation",
    is_admin: "Is Admin",
    gender: "Gender"
    // Add more key-value pairs as needed
};

const intial={
    yes:true,
    no:false
}

const AddNewUser = () => {
    const jwtToken = Cookies.get("jwt_token");
    const email = Cookies.get("email_address");

    const [customerKey, setCustomerKey] = useState([]);
    const [userDetailObject, setUserDetailObject] = useState({});
    const [selectOption, setSelectionOption] = useState([])
    const [showPopup, setShowPopup] = useState(false)
    const [onNewDesigntion, setonNewDesigntion] = useState("")
    const[isAdmin,setIsAdmin]=useState(false)

    useEffect(() => {
        const fetchData = async () => {
            const g = ['name', "email_address", 'password', 'phone_number', 'designation', 'is_admin', 'gender']
            const initialCustomerDetailObject = {};
            g.forEach(column => {
                initialCustomerDetailObject[column] = "";
            });
            setCustomerKey(g);
            setUserDetailObject(initialCustomerDetailObject);
        }
        fetchData();
    }, [jwtToken]);

    useEffect(() => {
        const fetchData = async () => {
            const url = `${websiteLink}gettingAllDesignation`
            const options = {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'GET',
            };
            const response = await fetch(url, options)
            if (response.ok) {
                const data = await response.json()
                setSelectionOption(data)
                setUserDetailObject(prevState => ({
                    ...prevState,
                    designation: data[0].designation
                }))
            }
        }
        fetchData()
    }, [])

    const onSubmitting = async (event) => {
        event.preventDefault();
        const { phone_number, password, email_address } = userDetailObject;

        if (phone_number === "" || password === "" || email_address === "") {
            alert("Enter All Input columns");
        } else {
            const url = `${websiteLink}registernewuser`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'POST',
                body: JSON.stringify(userDetailObject),
            };

            const response = await fetch(url, options);
            if (response.ok) {
                alert("Customer Details Inserted successfully");
                // Reset customerDetailObject to initial state
                const resetCustomerDetailObject = { ...userDetailObject };
                customerKey.forEach(column => {
                    resetCustomerDetailObject[column] = "";
                });
                setUserDetailObject(resetCustomerDetailObject);
            } else {
                alert("Error To Insert Customer Details");
            }
        }
    }

    const handleChange = (event) => {
        const { id, value } = event.target;
        setUserDetailObject(prevState => ({
            ...prevState,
            [id]: value
        }));
    }
    const onAdddesignation = async () => {
        if (onNewDesigntion !== "" && onNewDesigntion !== " ") {
            const details = {
                designation: onNewDesigntion
            }
            const url = `${websiteLink}insertingDesignation`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'POST',
                body: JSON.stringify(details),
            };
            const response = await fetch(url, options)
            if (response.ok) {
                setonNewDesigntion("")
                setShowPopup(false)
                alert("Designation inserted")
            } else {
                alert("Designation Already Exist")
            }
        }else{
            alert("Enter New Designation")
        }
    }

    const popupcontainer = () => (
        <div className='adduser-popup-container'>
            <input className='service-input't value={onNewDesigntion} onChange={(event) => setonNewDesigntion(event.target.value)} />
            <button className='popup-add-service-button' onClick={onAdddesignation} >Add</button>
        </div>
    )

    return (
        <div>
            <Navbar />
            <div className='home-container'>
                <MenuBar />
                <div className='addcustomer-content-container cc'>
                    <div className='form-details-sections'>
                        <form onSubmit={onSubmitting} className='addcustomer-form'>
                            <h2 className='addcustomer-form-heading'>Add New User Section</h2>
                            <hr className="form-edit-hr" />
                            {customerKey.map((each) => {
                                if (each === "id") {
                                    return null;
                                } else if (each === "designation") {
                                    return (<div key={each} className='addcustomer-form-item-container'>
                                        <label htmlFor={each} className='addcustomer-form-item-label'>{keyMapping[each]}</label>
                                        <select id="designation" value={each.designation} onChange={handleChange} className='adduser-select'>
                                            {selectOption.map(each => (
                                                <option value={each.designation}>{each.designation}</option>
                                            ))}
                                        </select>
                                        <button className='adduser-button' onClick={() => setShowPopup(!showPopup)} type="button" >Add Designation</button>
                                    </div>)
                                } else if (each === "is_admin") {
                                    return (<div key={each} className='addcustomer-form-item-container'>
                                        <label htmlFor={each} className='addcustomer-form-item-label'>{keyMapping[each]}</label>
                                        <select id="is_admin" onChange={handleChange} className='adduser-select'  >
                                            <option value={intial.no}>No</option>
                                            <option value={intial.yes} >Yes</option>
                                        </select>
                                    </div>)
                                }
                                else {
                                    return (
                                        <div key={each} className='addcustomer-form-item-container'>
                                            <label htmlFor={each} className='addcustomer-form-item-label'>{keyMapping[each]}</label>
                                            <input
                                                id={each}
                                                type={each.includes("phone_number") ? "tel" : "text"}
                                                value={userDetailObject[each]}
                                                onChange={handleChange}
                                                className='addcustomer-form-item-input'
                                            />
                                        </div>
                                    );
                                }
                            })}
                            <button type="submit" className='addcustomer-form-button'>Submit</button>
                        </form>
                        {showPopup === true ? popupcontainer() : ""} 
                    </div>
                   
                </div>
            </div>
        </div>
    );
}

export default AddNewUser;
