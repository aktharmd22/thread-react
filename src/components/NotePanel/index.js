
import Cookies from 'js-cookie';
import { MdDelete } from "react-icons/md";
import { RiPencilFill } from "react-icons/ri";

import React, { useState, useEffect, useRef } from 'react';

const jwtToken = Cookies.get('jwt_token')
const websiteLink='https://crmsnodebackend.smartyuppies.com/'

const NotePanel = (props) => {
    const { customerId } = props
    const [newNotes, setNewNotes] = useState("")
    const [noteToUpdate, setNoteToUpdate] = useState(false)
    const [updateNoteId, setUpdateNoteId] = useState("")
    const [selectedCustomerNotes, setSelectedCustomerNotes] = useState({})

    const notesListRef = useRef(null);

    useEffect(() => {
        if (notesListRef.current) {
            notesListRef.current.scrollTop = notesListRef.current.scrollHeight;
        }
    }, [selectedCustomerNotes]);

    useEffect(() => {
        const f = async () => {
            const options = {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'GET',
            }

            const noteResponse = await fetch(`${websiteLink}getNotesOfSingleCustomer/${customerId}`, options);
            if (noteResponse.ok === true) {
                const data = await noteResponse.json();
                setSelectedCustomerNotes(data)
            }
        }
        f()
    }, [])

    const noteRefetch = async () => {
        const updatedNoteResponse = await fetch(`${websiteLink}getNotesOfSingleCustomer/${customerId}`, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            }
        });

        if (updatedNoteResponse.ok) {
            const updatedNotes = await updatedNoteResponse.json();
            // setSelectedCustomerNotes(updatedNotes);
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

    return (
        <>{notesPanel()}</>
    )

}

export default NotePanel