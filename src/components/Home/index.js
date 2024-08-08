import React, {useEffect } from 'react';
import MenuBar from '../MenuBar'
import Navbar from '../Navbar';
import Cookies from "js-cookie";
import "./homeIndex.css"

const websiteLink='https://crmsnodebackend.smartyuppies.com/'

const Home =()=>{
    // const jwtToken = Cookies.get('jwt_token')
    
    // const email=Cookies.get("email_address")

    // useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const options = {
    //             headers: {
    //               Authorization: `Bearer ${jwtToken}`,
    //             },
    //             method: 'GET',
    //           }
    //         const response = await fetch('http://localhost:3000/',options);
    //         if (!response.ok) {
    //           throw new Error('Network response was not ok');
    //         }
    //         const result = await response.json();
    //         console.log(result)
    //       } catch (error) {
            
    //       } 
    //     };
    
    //     fetchData();
    //   });

    return(
    <div>
        <Navbar/>
        <div className='home-container'>
            <MenuBar/>
        
        </div>
    </div>)
}

export default Home