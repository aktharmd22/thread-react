import Cookies from "js-cookie"
import { useState,useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { IoMdNotifications } from "react-icons/io";
import "./navbarIndex.css"

const userId = Cookies.get("idu")
const jwtToken = Cookies.get("jwt_token")

const websiteLink='https://crmsnodebackend.smartyuppies.com/'

const Navbar = () => {
    const [toShowPopup, setPopup] = useState(false)
    const navigate = useNavigate();
    const todisplayPopup = toShowPopup ? "" : "popup-diplay"
    const email = Cookies.get("email_address")
    const name = email.split('@')[0]
    const profile = email[0].toUpperCase()
    const logoutPopup = () => setPopup(!toShowPopup)

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

    const logout = () => {
        Cookies.remove("uoi")
        Cookies.remove("isa")
        Cookies.remove("idu")
        Cookies.remove("jwt_token")
        return navigate("/userlogin")
    }

    const editNavigate = () => {
        return navigate("/profile")
    }

    return (
        <nav className="nav">
            <Link to="/customerdetails"><img src={`${process.env.PUBLIC_URL}/img/smartyeppiesphoto-1-removebg-preview.png`} alt="Image" className="logo" /></Link>
            <div className="end-container">
                <Link to='/notification'><IoMdNotifications className="bell-icon"/>{notificationData.length>0?notificationData.length:""}</Link>
                <div className="profile-letter-container"><button className="profile-letter" onClick={logoutPopup}>{profile}</button></div>
            </div>
            <div className={`popup ${todisplayPopup}`}>
                <div className='name-container'>
                    <div className="profile-letter-container">
                        <button className="profile-letter">{name[0]}</button>
                    </div>
                    <div className='logout-details-container'>
                        <p className='logout-name'>{name}</p>
                        <p className='logout-name'>{email}</p>
                    </div>

                </div>
                <div className='popup-button-container'>
                    <button className='edit-button' onClick={editNavigate}>Profile</button>
                    <button className='edit-button' onClick={logout}>Logout</button>
                </div>

            </div>
        </nav>
    )
}

export default Navbar 