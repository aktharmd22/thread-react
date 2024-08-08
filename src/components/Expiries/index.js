import React, { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import Navbar from '../Navbar';
import MenuBar from '../MenuBar';
import './index.css'
import { differenceInDays, parseISO } from 'date-fns'
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const websiteLink='https://crmsnodebackend.smartyuppies.com/'
const changeFormat = {
    service_name: "Service Name",
    name: "Name",
    expiry_date: "Expiry Date",
    date_of_purchase: "Date of Purchase",
    id: "Customer Id"
}

const jwtToken = Cookies.get('jwt_token')


const Expires = () => {
    const [dates, setDates] = useState({})
    const [expiryData, setExpiryData] = useState([])
    const [chartData, setChartData] = useState([])
    const [chartBy, setChartBy] = useState("day")
    const[expiryList,setExpiryList]=useState([])
    const[renewalList,setRenewalList]=useState([])

    const onhandleDate = event => {
        setDates(prev => ({
            ...prev,
            [event.target.id]: event.target.value
        }))
    }

    const fetchData = async () => {
        const url = `${websiteLink}this-month-renewal?specific=${chartBy}`
        console.log(process.env.WEBSITE_LINK)
        const option = {
            headers: {
                Authorization: `Bearer ${jwtToken}`
            },
            method: "GET"
        }
        const response = await fetch(url, option)
       // console.log(response)
        if (response.ok) {
            const data = await response.json()
            const details = [{ name: "expiries", value: data[0].expiry, color: '#bf4b21' }, { name: "Renewal", value: data[0].renewal, color: '#21bfa5' }]
            setChartData(details)
            setExpiryList(data[1].expiry_list)
            setRenewalList(data[1].renewal_list)
        }
    }

    useEffect(() => {
        fetchData()
    }, [chartBy])


    const onSearch = async () => {
        if (dates.start_date !== undefined && dates.end_date !== undefined) {
            const url = `${websiteLink}getExpiry?start_date=${dates.start_date}&end_date=${dates.end_date}`
            const option = {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                },
                method: "GET"
            }
            const response = await fetch(url, option)
            if (response.ok) {
                const data = await response.json()
                setExpiryData(data)
            }
        }
    }
    const formatTime = (t) => {

        const d = new Date(t)
        const r = `${d.getDate().toString().padStart(2, 0)}-${(d.getMonth() + 1).toString().padStart(2, 0)}-${d.getFullYear().toString().padStart(2, 0)}`
        return r
    }

    function daysUntilExpiry(expiryDate) {
        // Parse the expiry date string into a Date object
        const expiry = parseISO(expiryDate);

        // Get the current date
        const today = new Date();

        // Calculate the difference in days
        const daysAhead = differenceInDays(expiry, today);
        if (daysAhead > 0) {
            return `Expired in ${daysAhead}`
        } else {
            return 'Expired'
        }


    }



    return (
        <div>
            <Navbar />
            <div className='home-container'>
                <MenuBar />
                <div className='expiry-container'>
                    <select value={chartBy} onChange={(e) => setChartBy(e.target.value)} className='category-selection'>
                        <option value="day" id="day">Today</option>
                        <option value="month" id="month">This Month</option>
                    </select>
                    
                        <div className='chart-container'>
                            <div style={{
                                position: 'relative',
                                height: '250px',
                                width: '350px',
                                alignItems: 'center',
                                display: 'flex',
                                justifyContent: 'center',
                            }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0
                                }}>
                                    <PieChart width={350} height={250}>
                                        <Pie
                                            data={chartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="#8884d8" // This is the fill color for sectors, not the border color
                                            paddingAngle={5}
                                            label
                                            cornerRadius={4}
                                            stroke="none" // Set stroke to none to remove the pie border
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>

                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </div>
                                <h2 style={{
                                    "margin-top": '-11px',
                                    padding: 0,
                                    color: '#3021bf',
                                    fontSize: '20px', // Adjust the font size as needed
                                    fontWeight: 'bold' // Adjust the font weight as needed
                                }}>
                                    Total {chartData.reduce((acc, data) => acc + data.value, 0)}
                                </h2>
                            </div>
                            <div className='chart-expiry-container'>
                                <h3>Expiry List</h3>
                                <div className='expirylist-conatiner '>
                                    <div className='expiry-chart-list-heading-container d'>
                                        <p>Customer ID</p>
                                        <p>Service Name</p>
                                        <p>Expiry Date</p>
                                    </div>
                                    {expiryList.map(each=>(
                                        <Link to={`/customer-information/${each.customer_id}`} className='expiry-chart-list-heading-container ooo'>
                                            <p className='chart-list-items'>{each.customer_id}</p>
                                            <p className='chart-list-items'>{each.service_name}</p>
                                            <p className='chart-list-items'>{formatTime(each.expiry_date)}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                            <div className='chart-expiry-container'>
                                <h3>Renewal List</h3>
                                <div  className='expirylist-conatiner'>
                                    <div className='expiry-chart-list-heading-container'>
                                        <p>Customer ID</p>
                                        <p>Service Name</p>
                                        <p>Expiry Date</p>
                                    </div>
                                    {renewalList.map(each=>(
                                        <Link to={`/customer-information/${each.customer_id}`}className='expiry-chart-list-heading-container ooo'>
                                            <p>{each.customer_id}</p>
                                            <p>{each.service_name}</p>
                                            <p>{formatTime(each.renewal_date)}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    

                    <div className='total-date-container'>
                        <div className='input-container'>
                            <label htmlFor="start_date" className='date-label'>Start Date</label>
                            <input type="date" onChange={onhandleDate} id='start_date' value={dates["start_date"]} className='expiry-date-input' />
                        </div>
                        <div className='input-container'>
                            <label htmlFor="end_date" className='date-label'>End Date</label>
                            <input type="date" id='end_date' onChange={onhandleDate} value={dates["end_date"]} className='expiry-date-input' />
                        </div>
                    </div>
                    <div className='expiry-button-container'>
                        <button className='expiry-button' onClick={onSearch} >Search</button>
                    </div>
                    <div className='expriy-list-container'>
                        {
                            expiryData.map(each => (
                                <Link to={`/customer-information/${each.id}`} className='expiry-card'>
                                    {(Object.keys(each).map(key => (
                                        <div className='expiry-item-container'>
                                            <p className='expiry-item-heading'>{changeFormat[key]}</p>
                                            <p className='expiry-item'>{key === "expiry_date" || key === 'date_of_purchase' ? formatTime(each[key]) : each[key]}</p>
                                        </div>
                                    )))}
                                    <p className='expiryDate'>{daysUntilExpiry(each.expiry_date)}</p>
                                </Link>
                            ))
                        }
                    </div>

                </div>
            </div>
        </div>
    )

}
export default Expires