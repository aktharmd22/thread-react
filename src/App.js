import {Route, Routes, Navigate } from 'react-router-dom'
import Home from './components/Home'
import LoginPage from './components/LoginPage'
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './components/ProfilePage';
import Dashboard from './components/Dashboard'
import EditProfile from './components/EditProfile';
import CustomerDetailsbyService from './components/CustomerDetailsbyService';
import CustomerDetails from './components/CustomerDetails';
import AddcustomerDetails from './components/AddCustomer';
import CustomerInformation from './components/CustomerInformation';
import AddCustomerServices from './components/AddCustomerServices';
import UpdateCustomerDetails from './components/UpdateCustomerInformation';
import UpdateCustomerServices from './components/UpdateCustomerServices';
import UserDetails from './components/UserDetails'
import ImageUploader from './components/ImageUploader'
import AddNewUser from './components/AddNewUser';
import NotifcationPage from './components/NotificationPage';
import Expires from './components/Expiries';
import UpcommingUpdates from './components/UpcommingUpdates';
import './App.css';

const App= () =>{
  return (
    <Routes>
      <Route path="/userlogin" element={<LoginPage/>}/> 
      <Route exact path="/" element={<ProtectedRoute><Home/></ProtectedRoute>}  />
      <Route exact path="/imageuploader" element={<ProtectedRoute><ImageUploader/></ProtectedRoute>}  />
      <Route exact path="/notification" element={<ProtectedRoute><NotifcationPage/></ProtectedRoute>}/>
      <Route exact path="/add-newuser" element={<ProtectedRoute><AddNewUser/></ProtectedRoute>}  />
      <Route exact path="/userdetails" element={<ProtectedRoute><UserDetails/></ProtectedRoute>}  /> 
      <Route exact path="/admin-dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}  /> 
      <Route exact path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>}  /> 
      <Route exact path="/editprofile" element={<ProtectedRoute><EditProfile/></ProtectedRoute>}  /> 
      <Route exact path="/customerdetails" element={<ProtectedRoute><CustomerDetails/></ProtectedRoute>}  /> 
      <Route exact path="/customerdetailsbyservice" element={<ProtectedRoute><CustomerDetailsbyService/></ProtectedRoute>}  /> 
      <Route exact path="/Addcustomerdetails" element={<ProtectedRoute><AddcustomerDetails/></ProtectedRoute>}  /> 
      <Route exact path="/Customer-information/:id" element={<ProtectedRoute><CustomerInformation/></ProtectedRoute>}  /> 
      <Route exact path="/UpdateCustomerDetails/:id" element={<ProtectedRoute><UpdateCustomerDetails/></ProtectedRoute>}  /> 
      <Route exact path="/addcustomerservices/:id" element={<ProtectedRoute><AddCustomerServices/></ProtectedRoute>}  />
      <Route exact path='/expiries'  element={<ProtectedRoute><Expires/></ProtectedRoute>}/>
      <Route exact path='/upcomming-updates'  element={<ProtectedRoute><UpcommingUpdates/></ProtectedRoute>}/>
      <Route  path="/updateServiceList/:id/:customer_services_id" element={<ProtectedRoute><UpdateCustomerServices/></ProtectedRoute>}  />
      
    </Routes>
  
)
}

export default App;
