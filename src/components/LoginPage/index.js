import { Component } from "react";
import Cookies from "js-cookie";
import { useNavigate, Navigate } from 'react-router-dom';

import "./loginPage.css"

const websiteLink='https://crmsnodebackend.smartyuppies.com/'

class LoginPage extends Component {
  state = {
    emailAddress: "",
    password: "",
    showSubmitError: false,
  }

  onChangeUsername = event => {
    this.setState({ emailAddress: event.target.value })
  }

  onChangePassword = event => {
    this.setState({ password: event.target.value })
  }

  fetchData = async () => {
    const { emailAddress } = this.state
    const url = `${websiteLink}getUserid/${emailAddress}`
    const options = {
      method: 'GET',
    };
    const response = await fetch(url, options)
    if (response.ok) {
      const data = await response.json()
      Cookies.set("uoi", data[0].name, { expires: 30, path: '/' })
      Cookies.set("isa", data[0].is_admin, { expires: 30, path: '/' })
      Cookies.set("idu",data[0].id, { expires: 30, path: '/' })
    }
  }


  submitForm = async event => {
    event.preventDefault()
    const { emailAddress, password } = this.state
    const userDetails = { email_address: emailAddress, password }

    const url = `${websiteLink}userlogin`

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const response = await fetch(url, options)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const { navigate } = this.props;
      this.setState(prev => ({ showSubmitError: !prev.showSubmitError }))
      this.fetchData()
      Cookies.set('jwt_token', data.jwtToken, { expires: 30, path: '/' })
      Cookies.set('email_address', emailAddress, { expires: 30, path: '/' })
      navigate("/customerdetails",{replace:true})
    } else {
      this.setState(prev => ({ showSubmitError: !prev.showSubmitError }))
    }
  }


  renderUsernameField = () => {
    const { emailAddress } = this.state
    return (
      <>
        <label className="input-label" htmlFor="username">
          Email Address
        </label>
        <input
          type="text"
          id="username"
          className="username-input-field"
          value={emailAddress}
          onChange={this.onChangeUsername}
          placeholder="email address"
        />
      </>
    )
  }

  renderPasswordField = () => {
    const { password } = this.state
    return (
      <>
        <label className="input-label" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          id="password"
          className="password-input-field"
          value={password}
          onChange={this.onChangePassword}
          placeholder="Password"
        />
      </>
    )
  }

  render() {
    const { showSubmitError } = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Navigate to="/" />
    }
    return (
      <div className="login-page-container">
        <form className="form-container" onSubmit={this.submitForm}>
          <img src={`${process.env.PUBLIC_URL}/img/smartyeppiesphoto-1-removebg-preview.png`} alt="Image" className="logo" />
          <p className="text-1">Manage your customer effortlessly</p>
          <div className="input-containers">{this.renderUsernameField()}</div>
          <div className="input-containers">{this.renderPasswordField()}</div>
          <button type="submit" className="login-button">
            Login
          </button>

          {showSubmitError && <p className="error-message">* Invalid Credentials</p>}
        </form>
        <div></div>
      </div>
    )
  }
}

function WithNavigate(props) {
  const navigate = useNavigate();
  return <LoginPage {...props} navigate={navigate} />;
}

export default WithNavigate;

