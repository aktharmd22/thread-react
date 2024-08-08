import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import Navbar from '../Navbar';
import MenuBar from '../MenuBar';
import './index.css'

const jwtToken = Cookies.get("jwt_token")
const isAdmin = Cookies.get("isa")
const userId = Cookies.get('idu')

const websiteLink='https://crmsnodebackend.smartyuppies.com/'

const UpcommingUpdates = () => {
    const [updateList, setUpdateList] = useState([])
    const [inputText, setInputText] = useState("")

    const fetchData = async () => {
        const url = `${websiteLink}get-updates`
        const option = {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            },
            method: "GET"
        }
        const response = await fetch(url, option)
        if (response.ok) {
            const data = await response.json()
            setUpdateList(data)
        }
    }

    useEffect(() => {
        fetchData()
    })

    const formatDate = item => {
        const date = new Date(item);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const formatTime = (utcDateString) => {
        // Create a Date object from the UTC date string
        const utcDate = new Date(utcDateString);

        // Convert UTC time to IST (Indian Standard Time) and format in 12-hour format
        const istTime = utcDate.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour12: true, // Display in 12-hour format with AM/PM
            hour: 'numeric',
            minute: 'numeric'
        });

        return istTime;
    };

    const onSend = async () => {
        const url = `${websiteLink}insert-updates`
        const details = {
            text: inputText,
            inserted_by: userId
        }
        const option = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(details)
        }
        if (inputText.length > 4) {
            const response = await fetch(url, option)
            if (response.ok) {
                setInputText("")
                fetchData()
            }
        }

    }

    return (
        <div>
            <Navbar />
            <div className='home-container'>
                <MenuBar />
                <div className='updates-total-container'>

                    <div className='updates-message-section'>
                        {updateList.map(each => (
                            <div className='update-each-messages'>
                                <p className='updates-name'>{each.name}</p>
                                <div className='update-message-container'>
                                    <p >{each.text}</p>
                                    <p className='updates-message-time'>{formatDate(each.created_at)} {formatTime(each.created_at)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {isAdmin === "1" ? <div className='update-input-section'>
                        <textarea onChange={(e) => setInputText(e.target.value)} value={inputText} placeholder='Enter the Message'></textarea>
                        <button className='update-message-send-button' onClick={onSend}>
                            <div class="svg-wrapper-1">
                                <div class="svg-wrapper">
                                    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor"></path>
                                    </svg>
                                </div>
                            </div>
                            <span>Send</span>
                        </button>
                    </div> : ""}
                </div>
            </div>
        </div>
    )
}

export default UpcommingUpdates