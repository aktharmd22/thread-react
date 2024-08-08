import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";

import './index.css'

const jwtToken = Cookies.get("jwt_token")
const websiteLink='https://crmsnodebackend.smartyuppies.com/'

const EmailAutomation = (props) => {

    const { customerId, customerEmail } = props

    const [subject, setSubject] = useState("")
    const [text, setText] = useState("")


    const onSendMail = async () => {
        if (subject.length > 3 && text.length > 4) {
            const details = {
                to_mail: customerEmail,
                subject: subject,
                text: text
            }
            const url = `${websiteLink}send-email`
            const option = {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(details)
            }
            const response = await fetch(url, option)
            if (response.ok) {
                setText("")
                setSubject("")
                alert("Message sent Successfully")
                console.log("ture")
            }
        }
    }

    return (
        <div className='email-container'>
            <div className='subject'>
                <label htmlFor="subject">Subject</label>
                <input value={subject} type="text" id='subject' placeholder='Enter the Subject...' onChange={e=>setSubject(e.target.value)} />
            </div>
            <div className='subject'>
                <label htmlFor="compose_mail">Compose Mail</label>
                <textarea value={text} id="compose_mail" placeholder='Type the Text...' onChange={e=>setText(e.target.value)}></textarea>
            </div>
            <button className='email-send-button' onClick={onSendMail}>
                <div class="svg-wrapper-1">
                    <div class="svg-wrapper">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                        >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path
                                fill="currentColor"
                                d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                            ></path>
                        </svg>
                    </div>
                </div>
                <span>Send</span>
            </button>

        </div>
    )
}

export default EmailAutomation