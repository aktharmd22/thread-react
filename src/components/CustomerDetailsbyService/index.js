import MenuBar from '../MenuBar'
import Navbar from '../Navbar';
import Cookies from 'js-cookie';
import { RxCross1 } from "react-icons/rx";
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";
import { Link } from 'react-router-dom';

import React, { useState, useEffect, useRef } from 'react';
import "./customerDetailsIndex.css"

const jwtToken = Cookies.get('jwt_token')
const websiteLink='https://crmsnodebackend.smartyuppies.com/'


const CustomerDetails = () => {
    const [customerData, setCustomerData] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState({});
    const [selectedCustomerDetails, setSelectedCustomerDetails] = useState({})
    const [selectedCustomerNotes, setSelectedCustomerNotes] = useState({})
    const [popUpCustomerDetails, setPopUpCustomerDetails] = useState(false)
    const [newNotes, setNewNotes] = useState("")
    const [noteToUpdate, setNoteToUpdate] = useState(false)
    const [updateNoteId, setUpdateNoteId] = useState("")
    const customerId = selectedCustomerDetails.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const options = {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                    method: 'GET',
                }
                const response = await fetch(`${websiteLink}getServicesListOwnedbyCustomer`, options);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                console.log(result)
                setCustomerData(result);
                // Initialize filtered data with original data
                setFilteredData(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const notesListRef = useRef(null);

    useEffect(() => {
        if (popUpCustomerDetails && notesListRef.current) {
            notesListRef.current.scrollTop = notesListRef.current.scrollHeight;
        }
    }, [popUpCustomerDetails, selectedCustomerNotes]);

    const onChangeSearch = (event, key) => {
        const { value } = event.target;
        setSearchQuery(value);
        filterData(value, key);
    };

    const noteRefetch = async () => {
        const updatedNoteResponse = await fetch(`${websiteLink}getNotesOfSingleCustomer/${customerId}`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            }
        });

        if (updatedNoteResponse.ok) {
            const updatedNotes = await updatedNoteResponse.json();
            setSelectedCustomerNotes(updatedNotes);
        }
    }

    const onChangeNewNotes = (event) => {
        setNewNotes(event.target.value)
    }

    const addNewNote = async (id) => {

        if (noteToUpdate === true) {
            const url = `${websiteLink}updateNotes/${updateNoteId}`
            const details = { notes: newNotes }
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'PUT',
                body: JSON.stringify(details),
            };
            try {
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error('Failed to update note');
                }
                noteRefetch()
                setNewNotes("")
                setUpdateNoteId("")
                setNoteToUpdate(false)

            } catch (error) {
                console.error('Error update note:', error);
            }


        } else {

            const details = {
                customer_id: customerId,
                notes: newNotes
            };

            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'POST',
                body: JSON.stringify(details),
            };

            const url = `${websiteLink}insertNotes`;

            try {
                const response = await fetch(url, options);

                if (!response.ok) {
                    throw new Error('Failed to add note');
                }

                // Assuming the response indicates success, fetch updated notes
                noteRefetch()

                // Clear the newNotes state
                setNewNotes("");
            } catch (error) {
                console.error('Error adding note:', error);
            }
        }
    };



    const filterData = (value, key) => {
        if (!customerData[key]) return;

        const filtered = customerData[key].filter(item =>
            item.name.toLowerCase().includes(value.toLowerCase())||item.phone_number.toString().includes(value)||item.email_address.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredData(prevState => ({
            ...prevState,
            [key]: filtered
        }));
    };

    const deleteNote = async (id) => {
        const url = `${websiteLink}deleteNotes/${id}`
        const options = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            method: 'DELETE',
        }
        const response = await fetch(url, options)
        if (response.ok === true) {
            noteRefetch()
        }
    }

    const updatNote = async id => {
        setNoteToUpdate(true)
        const url = `${websiteLink}getNotes/${id}`
        const options = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            method: 'GET',
        }
        const response = await fetch(url, options)
        const data = await response.json()
        setNewNotes(data[0].notes)
        setUpdateNoteId(id)
    }

    const eachNotesItems = item => (
        item.map(each => (
            <li className='each-note-list'>
                <p className='each-note'>{each.notes}</p>
                <div className='each-note-time-container'>
                    <div className='each-note-time-button-container'>
                        <button onClick={() => deleteNote(each.id)} className='note-delete-button'><MdDelete className='delete-icon' /></button>
                        <button className='note-delete-button' onClick={() => updatNote(each.id)} ><RiPencilFill /></button>
                    </div>
                    <p className='each-note-time'>{formatTime(each.created_time)}</p>
                </div>
            </li>
        ))
    )

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

    const notesPanel = () => (
        <div className='notes-panel'>
            <div>
                <h3 className='note-heading'>Notes</h3>
                <ul className='notes-item-list-container' ref={notesListRef}>
                    {Object.keys(selectedCustomerNotes).map((date) => (
                        <>
                            <p className='notes-Date'>{formatDate(date)}</p>
                            {eachNotesItems(selectedCustomerNotes[date])}
                        </>
                    ))}</ul>
            </div>
            <div className='note-add-section'>
                <textarea className='note-add-box'
                    value={newNotes}
                    placeholder="Type your note here..."
                    onChange={onChangeNewNotes}
                />
                <button className='note-add-button' onClick={addNewNote}>Add</button>
            </div>
        </div>

    )


    const customerDetailsPopup = (details) => (
        <div className='popup-container'>
            <div className='popup-inside-container'>
                <ul className='popup-ul'>
                    {Object.keys(details).map(key => (
                        <li key={key} className='popup-li'>
                            <p className='popup-key'>{key}</p>
                            <p className='popup-value'>{details[key]}</p>
                        </li>
                    ))}
                </ul>
                {notesPanel()}
            </div>

            <button className='popup-close-button' onClick={() => setPopUpCustomerDetails(false)}><RxCross1 /></button>
        </div>
    );

    const onClickCustomerDetails = async (item) => {
        const options = {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
            method: 'GET',
        }
        const response = await fetch(`${websiteLink}getcustomerDetail/${item.id}/${item.service_name}`, options);
        if (response.ok === true) {
            const result = await response.json();
            setSelectedCustomerDetails(result[0])
            const noteResponse = await fetch(`${websiteLink}getNotesOfSingleCustomer/${item.id}`, options);
            if (noteResponse.ok === true) {
                const data = await noteResponse.json();
                setSelectedCustomerNotes(data)
                setPopUpCustomerDetails(true)
            }
        }


    }

    const customerList = items => {
        return (
            <ul>
                {items.map((item) => (
                    <li key={item.id} className='customer-preview-container' onClick={() => onClickCustomerDetails(item)}>
                        <Link to={`/customer-information/${item.id}`}>
                        <div className='customer-preview-container-list'>
                            <p className='customer-preview-container-item-1'>Name </p>
                            <p className='customer-preview-container-item-2'>{item.name}</p>
                        </div>
                        <div className='customer-preview-container-list'>
                            <p className='customer-preview-container-item-1'>Company Name</p>
                            <p className='customer-preview-container-item-2'>{item.company_name} </p>
                        </div>
                        <div className='customer-preview-container-list'>
                            <p className='customer-preview-container-item-1'>Purchased Value</p>
                            <p className='customer-preview-container-item-2'>{item.purchase_value}</p>
                        </div>
                        </Link>
                        
                    </li>
                ))}
            </ul>
        )
    };

    return (
        <div className='customer-page-container gg'>
            <Navbar />
            <div className='home-container '>
                <MenuBar />
                <div className='customer-content-container'>
                    <div className='customer-details-column'>
                        {Object.keys(customerData).map((key) => (
                            <div key={key} className='service-card'>
                                <h2 className='service-heading'>{key}</h2>
                                <input
                                    onChange={(event) => onChangeSearch(event, key)}
                                    type="search"
                                    placeholder="Search..." className='customer-section-search'
                                />
                                {customerList(filteredData[key] || [])}
                            </div>
                        ))}
                    </div>
                </div>
                {/* {popUpCustomerDetails && customerDetailsPopup(selectedCustomerDetails)} */}
            </div>

        </div>
    )
};
export default CustomerDetails;
