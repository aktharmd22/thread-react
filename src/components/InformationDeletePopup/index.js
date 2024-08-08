import "./index.css"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"

const jwtToken = Cookies.get('jwt_token')
const websiteLink='https://crmsnodebackend.smartyuppies.com/'
const InformationDeletePopup = (props) => {
    const navigate=useNavigate()
    const {customerId,setshowDeleteWarning}=props
    
    const onDelete=async()=>{
        const url=`${websiteLink}deleteCustomerDetails/${customerId}`
        const options = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${jwtToken}`,
            },
            method: 'DELETE'      
        };
        const response= await fetch(url,options)
        if(response.ok===true){
            navigate("/customerdetails")
        }
    }

    return (
        <div className="delete-popup">
            <div className="popup-delete-container">
                <p>Are You Sure To delete Customer ?</p>
                <div className="popup-delete-button-container">
                    <button className="popup-delete-button" onClick={onDelete}>Yes</button>
                    <button className="popup-delete-button" onClick={()=>setshowDeleteWarning(false)}>No</button>
                </div>
            </div>

        </div>
    )

}

export default InformationDeletePopup