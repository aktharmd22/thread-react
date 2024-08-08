import React, { useState, useEffect } from "react";
import Navbar from '../Navbar';
import MenuBar from '../MenuBar';
import Cookies from "js-cookie"
import './index.css'
import { Link } from "react-router-dom";
const userId = Cookies.get("idu")
const jwtToken = Cookies.get("jwt_token")

const websiteLink='https://crmsnodebackend.smartyuppies.com/'

const formate = {
    customer_id: "Customer ID",
    assigned_by: "Assigned By",
    text: "Description",
    deadline: "DeadLine",
    status: "Status"

}

const NotifcationPage = () => {

    const [notificationData, setNotificationData] = useState([])

    const fetchData = async () => {
        const url = `${websiteLink}getnotification/${userId}`
        const options = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            method: 'GET',
        }
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json()
            console.log(data)
            setNotificationData(data)
        }
    }
    useEffect(() => {
        fetchData()
    }, [userId])

    const formatTime = (t) => {
        const v = t.split("T")
        const date = new Date(v[0])
        const d = `${date.getUTCDate().toString().padStart(2, '0')}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`
        return d
    }

    return (
        <div className="notication-total-page">
            <Navbar />
            <div className='notification-two-container'>
                <MenuBar />
                <div className="notificatoin-cpage-container">
                    <h1 className="notification-heading">Notifications !</h1>
                    <div className="total-notification-container">
                        {
                            notificationData.map(each => (
                                <Link to={`/customer-information/${each.customer_id}`} className="notification-item-container">
                                    {
                                        Object.keys(each).map(key => {
                                            if (key !== "id" && key !== "assigned_to") {
                                                return (
                                                    <div className="notification-item-box">
                                                        <p className="notification-item-heading">{formate[key]}</p>
                                                        <p className="notification-item">{key==="deadline"?formatTime(each[key]) :each[key]}</p>
                                                    </div>
                                                )
                                            }
                                        })
                                    }

                                </Link>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotifcationPage