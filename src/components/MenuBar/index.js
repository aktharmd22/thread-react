import { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";

import "./menuBarIndex.css"
const jwtToken = Cookies.get("jwt_token");
const email = Cookies.get("email_address");
const isAdmin=Cookies.get("isa")

class MenuBar extends Component {
    state = {
        item1: false,
        item2: false
    }

  

    item1ToDisplay = () => {
        this.setState(prev => ({ item1: !prev.item1 }))
    }

    item2ToDisplay = () => {
        this.setState(prev => ({ item2: !prev.item2 }))
    }

    render() {
        const { item1, item2 } = this.state

        const dropdown1 = item1 ? "to-display" : ""
        const dropdown2 = item2 ? "to-display" : ""

        const upArrow1 = item1 ? "to-display" : "dont-display"
        const downArrow1 = item1 ? "dont-display" : "to-display"

        const upArrow2 = item2 ? "to-display" : "dont-display"
        const downArrow2 = item2 ? "dont-display" : "to-display"

        return (
            <div className="menu-container">
                <div className="item-1" onClick={this.item1ToDisplay}>
                    <p>Customer</p>
                    <RiArrowDropDownLine size={25} className={`${downArrow1}`} />
                    <RiArrowDropUpLine size={25} className={`${upArrow1}`} />
                </div>
                <div className={`${dropdown1} item-1-dropdown`}>
                    <Link className="customer-item-container Link" to="/customerdetails"><p className="customer-items">Customer Details</p></Link>
                    <Link className="customer-item-container Link" to="/customerdetailsbyservice"><p className="customer-items">Customer Details By Service</p></Link>
                </div>
                {/* <Link className="customer-item-container" to="/admin-dashboard"><p className="customer-items">DashBoard</p></Link> */}
                {isAdmin === "1" ? <Link className="customer-item-container" to="/UserDetails"><p className="customer-items">User Details</p></Link> : ""}
                <Link className="customer-item-container" to="/expiries"><p className="customer-items single">Upcomming Expires</p></Link>
                <Link className="customer-item-container" to="/upcomming-updates"><p className="customer-items single">Updates</p></Link>
            </div>
        )
    }
}

export default MenuBar