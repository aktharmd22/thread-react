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
    alternate_email_address: "Alternate Email Address"
    // Add more key-value pairs as needed
};

const AddCustomerDetails = () => {
    const jwtToken = Cookies.get("jwt_token");
    const email = Cookies.get("email_address");

    const [customerKey, setCustomerKey] = useState([]);
    const [customerDetailObject, setCustomerDetailObject] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            const url = `${websiteLink}getCustomerColumnName`;
            const options = {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'GET',
            };
            const response = await fetch(url, options);
            const columnNames = await response.json();
            const g = columnNames.map(item => item.COLUMN_NAME);
            const initialCustomerDetailObject = {};
            g.forEach(column => {
                initialCustomerDetailObject[column] = "";
            });
            setCustomerKey(g);
            setCustomerDetailObject(initialCustomerDetailObject);
        }
        fetchData();
    }, [jwtToken]);

    const onSubmitting = async (event) => {
        event.preventDefault();
        const { phone_number, company_name, email_address } = customerDetailObject;

        if (phone_number === "" || company_name === "" || email_address === "") {
            alert("Enter All Input columns");
        } else {
            const url = `${websiteLink}insertingCustomerInformation`;
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'POST',
                body: JSON.stringify(customerDetailObject),
            };

            const response = await fetch(url, options);
            if (response.ok) {
                alert("Customer Details Inserted successfully");
                // Reset customerDetailObject to initial state
                const resetCustomerDetailObject = { ...customerDetailObject };
                customerKey.forEach(column => {
                    resetCustomerDetailObject[column] = "";
                });
                setCustomerDetailObject(resetCustomerDetailObject);
            } else {
                alert("Error To Insert Customer Details");
            }
        }
    }

    const handleChange = (event) => {
        const { id, value } = event.target;
        setCustomerDetailObject(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    return (
        <div>
            <Navbar />
            <div className='home-container'>
                <MenuBar />
                <div className='addcustomer-content-container'>
                    <form onSubmit={onSubmitting} className='addcustomer-form'>
                    <h2 className='addcustomer-form-heading'>Add New Customer Section</h2>
                    <hr className="form-edit-hr" />
                        {customerKey.map((each) => {
                            if (each === "id") {
                                return null;
                            } else {
                                return (
                                    <div key={each} className='addcustomer-form-item-container'>
                                        <label htmlFor={each} className='addcustomer-form-item-label'>{keyMapping[each]}</label>
                                        <input
                                            id={each}
                                            type={each.includes("phone_number") ? "tel" : "text"}
                                            value={customerDetailObject[each]}
                                            onChange={handleChange}
                                            className='addcustomer-form-item-input'
                                        />
                                    </div>
                                );
                            }
                        })}
                        <button type="submit" className='addcustomer-form-button'>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddCustomerDetails;
