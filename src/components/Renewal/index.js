import React, { useState, useEffect } from 'react';

import Cookies from 'js-cookie';
import './index.css'

const jwtToken = Cookies.get("jwt_token")
const { differenceInDays } = require('date-fns');

const websiteLink='https://crmsnodebackend.smartyuppies.com/'

const changeFormat = {
    service_name: "Service Name",
    expiry_date: "Expiry Date",
    date_of_purchase: "Purchase Date",
    renewal_date: "Renewal Date"
}

const Renewal = (props) => {
    const { customerId } = props
    const [renewalData, setRenewalData] = useState([])
    const [toShowHistory, setToShowHistory] = useState("")
    const [renewalDate, setRenewalDate] = useState("")
    const [expiryDate, setExpiryDate] = useState("")
    const [selectPrice, setPrice] = useState(0)

    const fetchData = async () => {
        const url = `${websiteLink}get-renewal/${customerId}`
        const option = {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            },
            method: "GET"
        }
        const response = await fetch(url, option)
        if (response.ok) {
            const data = await response.json()

            setRenewalData(data)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const dateFormat = dateString => {
        const date = new Date(dateString);

        // Extract day, month, and year
        const day = String(date.getDate()).padStart(2, '0'); // Day with leading zero if needed
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month with leading zero if needed
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    }

    const onAddRenewal = async (customerserviceTableId, serviceId) => {

        const date1 = new Date(renewalDate);
        const date2 = new Date(expiryDate);

        const difference = differenceInDays(date2, date1);
        const details = {
            customer_id: customerId,
            expiry_date: expiryDate,
            price: selectPrice,
            renewal_date: renewalDate,
            service_id: serviceId,
            customer_service_table_id: customerserviceTableId
        }
        const url = `${websiteLink}insert-renewal`
        const option = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`
            },
            method: "POST",
            body: JSON.stringify(details)
        }
        if(difference<0){
            alert("Expiry Not Lesser than Renewal Date ")
        }
        else if (expiryDate.length > 3 && renewalDate.length > 3 && selectPrice.length > 0) {
            const response = await fetch(url, option)

            if (response.ok) {
                fetchData()
                setExpiryDate("")
                setRenewalDate("")
                setPrice("")
            }
        } else {
            alert("Enter all inputs")
        }

    }

    return (
        <div className='renewal-container'>
            {
                renewalData.map(each => {
                    return (<div className='renewal-list' onClick={() => setToShowHistory(each.customer_service_table_id)}>
                        <div className='renewal-list-1'>
                            {Object.keys(each).map((key) => {
                                if (key === "service_name") {
                                    return (
                                        <div className='renewal-list-container'>
                                            <p className='renewal-list-item-1'>{changeFormat[key]}</p>
                                            <p className='renewal-list-item'>{each[key]}</p>
                                        </div>
                                    )
                                } else if (key === "expiry_date" || key === "date_of_purchase") {
                                    return (
                                        <div className='renewal-list-container'>
                                            <p className='renewal-list-item-1'>{changeFormat[key]}</p>
                                            <p className='renewal-list-item'>{dateFormat(each[key])}</p>
                                        </div>
                                    )
                                }
                            })}
                            <div className='renewal-list-container'>
                                <p className='renewal-list-item-1'>Last Renewal</p>
                                <p className='renewal-list-item'>{each.renewal_table_list.length > 0 ? dateFormat(each.renewal_table_list[0].renewal_date) : "No Renewal Yet"}</p>
                            </div>
                        </div>

                        {toShowHistory === each.customer_service_table_id ? <>
                            <div className='renewal-history-container'>
                                <h3 className='renewal-history-h3'>Renewal History</h3>
                                <div className='renewal-history-heading-section'>
                                    <p className='renewal-history-heading'>Seirel No</p>
                                    <p className='renewal-history-heading'>Date</p>
                                    <p className='renewal-history-heading'>Price</p>
                                </div>
                                {each.renewal_table_list.length > 0 ? (
                                    each.renewal_table_list.map((renewal, index) => (
                                        <div className='renewal-history-element-section' key={index}>
                                            <p className='renewal-history-element'>{index + 1}</p>
                                            <p className='renewal-history-element'>{dateFormat(renewal.renewal_date)}</p>
                                            <p className='renewal-history-element'>{renewal.price}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>No History</p>
                                )}

                            </div>
                            <div className='renewal-add-container'>
                                <div className='setDate'>
                                    <div className='renewal-date-container'>
                                        <label >Set Renewal Date</label>
                                        <input value={renewalDate} type="date" onChange={(e) => setRenewalDate(e.target.value)} />
                                    </div>
                                    <div className='renewal-date-container'>
                                        <label >Set Expiry Date</label>
                                        <input value={expiryDate} type="date" onChange={(e) => setExpiryDate(e.target.value)} />
                                    </div>
                                    <div className='renewal-date-container'>
                                        <label >Set Price</label>
                                        <input value={selectPrice} type="number" onChange={(e) => setPrice(e.target.value)} />
                                    </div>
                                </div>
                                <button onClick={() => onAddRenewal(each.customer_service_table_id, each.service_id)}>Add Renewal</button>
                            </div>
                        </> : ""}
                    </div>)
                })
            }
        </div>
    )

}
export default Renewal