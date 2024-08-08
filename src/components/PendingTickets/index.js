import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import "./index.css";

const email_address = Cookies.get("email_address");
const jwtToken = Cookies.get("jwt_token");
const websiteLink='https://crmsnodebackend.smartyuppies.com/'

const PendingTickets = (props) => {
    const { updatePendingTickets } = props

    const [pendingData, setPendingData] = useState([]);
    const [pendingStatus, setPendingStatus] = useState({});
    const [issueTicketsData, setIssueTicketsData] = useState([])
    const [issueText, setIssueText] = useState({})
    const [userDetails, setUserDetails] = useState({})
    const [toShowClickedItem, SetToShowClickedItem] = useState("")

    const fetchData1 = async () => {
        const url = `${websiteLink}get-tickets/${props.customerId}/${email_address}`;
        const options = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            method: 'GET',
        };
        const response = await fetch(url, options);
        if (response.ok) {
            const data = await response.json();
            //console.log(data);
            setPendingData(data);
        }
    };

    useEffect(() => {
        fetchData1();
    }, [props.customerId, email_address, jwtToken, issueText, updatePendingTickets]);

    const fetchData2 = async () => {
        const url = `${websiteLink}getTicketsissue/${props.customerId}`
        const options = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            method: 'GET',
        };
        const response = await fetch(url, options)
        if (response.ok === true) {
            const data = await response.json()
            setIssueTicketsData(data)
        }
    }

    useEffect(() => {
        fetchData2()
    }, [props.customerId, jwtToken])

    useEffect(() => {
        const fetchData = async () => {
            const url = `${websiteLink}getUserByEmail/${email_address}`
            const options = {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'GET',
            };
            const response = await fetch(url, options)
            if (response.ok) {
                const data = await response.json()
                setUserDetails(data[0])
            }
        }
        fetchData()
    }, [email_address])

    const times = (item) => {
        const timestamp = item;
        const dateObj = new Date(timestamp);

        const day = dateObj.getUTCDate().toString().padStart(2, '0');
        const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = dateObj.getUTCFullYear();

        const formattedDate = `${day}-${month}-${year}`;
        return formattedDate;
    };

    const onChanging = (id, event) => {
        const newStatus = event.target.value;
        setPendingStatus(prevStatus => ({
            ...prevStatus,
            [id]: newStatus
        }));
    };

    // const submitChanges = () => {
    //     const url = `http://localhost:3000/update-tickets`
    //     Object.keys(pendingStatus).map(key => {
    //         const details = {
    //             id: key,
    //             status: pendingData[key]  // Example transformation (doubling each value)
    //         };
    //         const options = {

    //         }

    //     });
    // }

    const onHandlingText = event => {
        setIssueText(prevStatus => ({
            ...prevStatus,
            [event.target.id]: event.target.value
        }));
    }

    const addNewIssueText = async (id) => {
        const details = {
            text: issueText[id],
            added_by: userDetails.id,
            ticket_id: id,
            customer_id: props.customerId,
        };

        const url = `${websiteLink}insert-issue`;
        const option = {
            headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            method: "POST",
            body: JSON.stringify(details),
        };

        try {
            const response = await fetch(url, option);
            if (response.ok) {
                fetchData1()
                fetchData2()
                setIssueText({ ...issueText, [id]: "" });
                const url1 = `${websiteLink}update-tickets`
                const detail = {
                    id: id,
                    status: pendingStatus[id] || pendingData[id].status
                }
                const options = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${jwtToken}`,
                    },
                    method: "PUT",
                    body: JSON.stringify(detail),
                };
                console.log(detail)

                const response1 = await fetch(url1, options)
                console.log(response1)
                console.log(response)
                console.log("detail")
                if (response1.ok) {                   
                    fetchData2()
                }
                // Optionally, update issueTicketsData if needed
            } else {
                alert("Failed to add issue");
            }
        } catch (error) {
            console.error("Error adding issue:", error);
        }
    };

    const getTime = (t) => {
        const utcTimestamp = t;

        // Parse the UTC timestamp
        const utcDate = new Date(utcTimestamp);

        // Convert to IST
        const options = {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        };
        const istTimeOnly = new Intl.DateTimeFormat('en-US', options).format(utcDate);

        return (istTimeOnly);

    }




    const notesUpdateSection = (id, status) => {
        const currentStatus = pendingStatus[id] || status;
        return (
            <div>
                <h1 className='note-headings'>Notes</h1>
                <div className='issue-section'>
                    <div className='notes-total-conatiner'>
                        <div className='issue-note-headings'>
                            <p className='no'>no</p>
                            <p className='issue-note-headings-items text'>Text</p>
                            <p className='issue-note-headings-items'>Date</p>
                            <p className='issue-note-headings-items'>Time</p>
                            <p className='issue-note-headings-items'>Added by</p>
                        </div>
                        {
                            issueTicketsData.map((each, index) => {
                                let no = index
                                if (each.ticket_id === id) {
                                    return (
                                        <div className='issue-note-headings issue-note-items'>
                                            <p className='no'>{no}</p>
                                            <p className='issue-note-items-elements text'>{each.text}</p>
                                            <p className='issue-note-items-elements'>{times(each.inserted_date)}</p>
                                            <p className='issue-note-items-elements'>{getTime(each.inserted_date)}</p>
                                            <p className='issue-note-items-elements'>{each.name}</p>
                                        </div>
                                    )

                                }
                            })
                        }
                    </div>
                    <div className='issueUpdateSection'>
                        <textarea value={issueText[id]} className='issueUpdateInput' id={id} onChange={onHandlingText}></textarea>
                        <select
                            value={currentStatus}
                            className='pending-select-input'
                            onChange={(e) => onChanging(id, e)}
                        >
                            <option value="open" className='pending-option'>Open</option>
                            <option value="pending" className='pending-option'>Pending</option>
                            <option value="closed" className='pending-option'>Closed</option>
                        </select>
                        <button id={id} onClick={(e) => (addNewIssueText(id))} className='issueUpdateButton'>submit</button>
                    </div>
                </div>

            </div>
        )
    }

    const eachList = each => {


        return (
            <li key={each.id} className={`pending-total-list ${each.status}`} onClick={() => SetToShowClickedItem(each.id)} >
                <div className='pending-list-container'>
                    <div className='pending-list-item-container'>
                        <p className='pending-list-item-heading'>Case ID</p>
                        <p className='pending-list-item'>{each.id}</p>
                    </div>
                    <div className='pending-list-item-container'>
                        <p className='pending-list-item-heading'>Status</p>
                        <p className='pending-list-item'>{each.status}</p>
                    </div>
                    <div className='pending-list-item-container'>
                        <p className='pending-list-item-heading'>Assigned to</p>
                        <p className='pending-list-item'>{each.name}</p>
                    </div>
                    <div className='pending-list-item-container'>
                        <p className='pending-list-item-heading issue-text'>Issue</p>
                        <p className='pending-list-item issue-text'>{each.text}</p>
                    </div>
                    <div className='pending-list-item-container'>
                        <p className='pending-list-item-heading'>Deadline</p>
                        <p className='pending-list-item'>{times(each.deadline)}</p>
                    </div>
                    <div className='pending-list-item-container'>
                        <p className='pending-list-item-heading'>Assigned By</p>
                        <p className='pending-list-item'>{each.assigned_by}</p>
                    </div>
                </div>
                {toShowClickedItem === each.id ? notesUpdateSection(each.id, each.status) : ""}
            </li>
        );
    };

    return (
        <div>
            <ul className='pending-data-container'>{pendingData.map(each => eachList(each))}</ul>
            {/* <button onClick={submitChanges}>Submit Change</button> */}
        </div>
    );
};


export default PendingTickets;
