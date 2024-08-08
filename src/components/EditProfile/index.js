import Cookies from "js-cookie";
import Navbar from '../Navbar';
import MenuBar from '../MenuBar';
import React, { useState, useEffect } from 'react';
import { FaBell } from "react-icons/fa";
import "./editProfile.css";

const websiteLink='https://crmsnodebackend.smartyuppies.com/'

const EditProfile = () => {
    const [data, setData] = useState({});
    const [givenName, setGivenName] = useState("");
    const [givenPassword, setGivenPassword] = useState("");
    const [givenGender, setGivenGender] = useState("");
    const [givenPhoneNumber, setGivenPhoneNumber] = useState("");
    const [popupMessage, setPopupMessage] = useState("");
    const [notificationPopupTextColor, setNotificationPopupTextColor] = useState("")

    const jwtToken = Cookies.get("jwt_token");
    const email = Cookies.get("email_address");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const options = {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                    method: 'GET',
                };
                const url = `${websiteLink}getUserByEmail/${email}`;
                const response = await fetch(url, options);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();

                setData(result[0]);
                setGivenName(result[0].name);
                setGivenGender(result[0].gender);
                setGivenPhoneNumber(result[0].phone_number);
                console.log(result);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [jwtToken, email]);

    const onClickUpdate = async (event) => {
        event.preventDefault();

        if (givenName.trim().length === 0 || givenPassword.trim().length === 0 || givenGender.trim().length === 0 || givenPhoneNumber.length < 9) {
            setPopupMessage("Please enter valid inputs");
            setTimeout(() => {
                setPopupMessage(""); // Clear popup message after 10 seconds
            }, 2000);
            setNotificationPopupTextColor("bg-danger")
            return;
        }

        const updatedDetails = {
            name: givenName,
            password: givenPassword,
            gender: givenGender,
            phone_number: givenPhoneNumber,
        };

        try {
            const options = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${jwtToken}`,
                },
                method: 'PUT',
                body: JSON.stringify(updatedDetails),
            };
            const url = `${websiteLink}admin/updateUserList/${data.id}`;
            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setPopupMessage('Profile updated successfully');
            setNotificationPopupTextColor("bg-success")
            setTimeout(() => {
                setPopupMessage(""); // Clear popup message after 10 seconds
            }, 2000); // 10000 milliseconds = 10 seconds
        } catch (error) {
            console.error('Error updating profile:', error);
            setPopupMessage('Error updating profile');
            setNotificationPopupTextColor("bg-danger")
            setTimeout(() => {
                setPopupMessage(""); // Clear popup message after 10 seconds
            }, 2000); // 10000 milliseconds = 10 seconds
        }
    };

    const onChangeName = event => setGivenName(event.target.value);
    const onChangePassword = event => setGivenPassword(event.target.value);
    const onChangeGender = event => setGivenGender(event.target.value);
    const onChangePhoneNumber = event => setGivenPhoneNumber(event.target.value);

    return (
        <div>
            <Navbar />
            <div className='home-container'>
                <MenuBar />
                <div className="editpage-container">
                    <form onSubmit={onClickUpdate} className="editpage-form-container">
                        <h2 className="edit-page-heading">Update Your Profile</h2>
                        <hr className="edit-hr" />
                        <div className="edit-form-item-container">
                            <label htmlFor="name" className="edit-form-label">Name</label>
                            <input type="text" value={givenName} onChange={onChangeName} id="name" className="edit-form-input" />
                        </div>
                        <div className="edit-form-item-container">
                            <label htmlFor="password" className="edit-form-label">Password</label>
                            <input placeholder="Give New or Old Password" type="text" value={givenPassword} id="password" onChange={onChangePassword} className="edit-form-input" />
                        </div>
                        <div className="edit-form-item-container">
                            <label htmlFor="gender" className="edit-form-label">Gender</label>
                            <input type="text" value={givenGender} id="gender" onChange={onChangeGender} className="edit-form-input" />
                        </div>
                        <div className="edit-form-item-container">
                            <label htmlFor="phone" className="edit-form-label">Phone Number</label>
                            <input type="tel" id="phone" value={givenPhoneNumber} onChange={onChangePhoneNumber} className="edit-form-input" />
                        </div>
                        <button type="submit" className="update-button">Update</button>
                    </form>
                    {popupMessage && <div className="notification-popup"> <FaBell className={`${notificationPopupTextColor}`} /><p className={`${notificationPopupTextColor}`}>{popupMessage}</p></div>}
                </div>
            </div>
        </div>
    );
};

export default EditProfile;
