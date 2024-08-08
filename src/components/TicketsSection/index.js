import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import "./index.css"

const jwtToken = Cookies.get("jwt_token")
const userId=Cookies.get("uoi")

const websiteLink='https://crmsnodebackend.smartyuppies.com/'

const TicketsSection = props => {
    const { customerId, setToShowTicketSection,onhandlingNewTicket } = props
    console.log(customerId)
    const [userData, setUserData] = useState([])
    const [ticketsDetails, setTicketsDetails] = useState({ customer_id: customerId, status: "open", assigned_to: "", deadline: "", text: "" });



    useEffect(() => {
        const fetchData = async () => {
            const url = `${websiteLink}admin/getAgentList`
            const options = {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'GET',
            };
            const response = await fetch(url, options)
            if (response.ok) {
                const data = await response.json()
                setUserData(data)
                setTicketsDetails(prev => ({
                    ...prev,
                    assigned_to: data[0].id,
                    assigned_by:userId
                }))
                console.log(data)
            }
        }
        fetchData()
    }, [])

    const handleChange = (event) => {
        const { id, value } = event.target;
        setTicketsDetails(prevState => ({
            ...prevState,
            [id]: value
        }));
    }

    const submitting = async (event) => {
        event.preventDefault();
        const details = { ...ticketsDetails, customer_id: customerId };
    
        if (!details.assigned_to || !details.text || !details.status || !details.deadline) {
            alert("Enter all Details");
        } else {
            const url = `${websiteLink}insert-new-tickets`;
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
                    alert("Tickets Inserted Successfully");
                    // Reset form fields after successful submission
                    setTicketsDetails({ customer_id: customerId, status: "open", assigned_to: "", deadline: "", text: "" });
                    onhandlingNewTicket()
                    
                    // Optionally, you can trigger a refresh or update in parent component if needed
                } else {
                    alert("Error to insert");
                }
            } catch (error) {
                console.error("Error inserting tickets:", error);
            }
        }
    };
    

    return (
        <div className="ticket-section" >
            <button onClick={() => setToShowTicketSection(false)}>close</button>
            <form onSubmit={submitting} >
                <div className="ticket-section-item-container">
                    <label htmlFor="status" className="ticket-label">Status</label>
                    <select className="ticket-input" id="status" value={ticketsDetails.status} onChange={handleChange}>
                        <option value="open">Open</option>
                        <option value="pending">Pending</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
                <div className="ticket-section-item-container">
                    <label htmlFor="assigned_to" className="ticket-label">Assigned to</label>
                    <select className="ticket-input" id="assigned_to" value={ticketsDetails.assigned_to} onChange={handleChange}>
                        {
                            userData.map(each => (
                                <option id={each.id} value={each.id} key={each.id}>{each.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="ticket-section-item-container">
                    <label htmlFor="text" className="ticket-label">Text</label>
                    <textarea id="text" value={ticketsDetails.text} className="ticket-input" placeholder="Enter the task" onChange={handleChange}></textarea>
                </div>
                <div className="ticket-section-item-container">
                    <label htmlFor="deadline" className="ticket-label">Deadline</label>
                    <input type="date" id="deadline" value={ticketsDetails.deadline} className="ticket-input input-date" onChange={handleChange} />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>

    )
}

export default TicketsSection