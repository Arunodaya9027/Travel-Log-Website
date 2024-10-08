import { React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css';
import Navbar from '../Navbar';
import AuthNav from '../AuthNav';
import axios from 'axios';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function User() {
  const values = [true, 'sm-down', 'md-down', 'lg-down', 'xl-down', 'xxl-down'];
  const [fullscreen, setFullscreen] = useState(true);
  const [show, setShow] = useState(false);
  const [otp, setOtp] = useState(0);
  const [checkOtp, setCheckOtp] = useState(null);
  const [mailStatus, setMailStatus] = useState(null);

  const [isLogin, setIsLogin] = useState(true);
  const [isError, setIsError] = useState(false);
  const [session, setSession] = useState({ id: null, status: false });
  const [id, setId] = useState(null);
  const navigate = useNavigate();
  const switchToLogin = () => {
    setIsLogin(true);
  };

  const switchToSignup = () => {
    setIsLogin(false);
  };
  console.log(isLogin);

  const [loginData, setLoginData] = useState({
    name: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    userName: "",
    email: "",
    password: "",
    cfp: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(isLogin) {
      setLoginData({
        ...loginData,
        [name]: value,
      });
      console.log(loginData);
    } else {
      setRegisterData({
        ...registerData,
        [name]: value,
      });
      console.log(registerData);
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(isLogin) {
      console.log(loginData);
      await axios.post("http://localhost:5000/auth/login", loginData)
      .then((res) => {
        if (res.status === 200) { // Assuming successful login response has status 200
          console.log(res.data);
          const id = res.data.user._id;
          const currentDate = moment();
          const formattedDate = currentDate.format('YYYY-MM-DD HH:mm:ss');

          console.log(id);
          setSession({
            id: id,
            status: true,
          })
            // Redirect to profile setup page on successful register
          axios.post("http://localhost:5000/auth/create-session", {id: id, startTime: formattedDate})
          .then((res) => {
            if (res.status === 200) {
              console.log(session);
              localStorage.setItem('session', id);
              console.log(res.data);
              navigate('/'); // Redirect to dashboard on successful login
            }
          })
          .catch((err) => {
            console.log("error", err);
          });
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
    } else {
      console.log(registerData);
      axios.post("http://localhost:5000/auth/register", registerData)
      .then((res) => {
        if (res.status === 200) { // Assuming successful register response has status 200
          setIsError(false);
          console.log(res);
          const id = res.data._id;
          const currentDate = moment();
          const formattedDate = currentDate.format('YYYY-MM-DD HH:mm:ss');

          console.log(id);
          setId(id);
          navigate(`/signup-process/1f4e5749tgw3450-rw43vdbh/validate-otp/${id}`); // Redirect to authenticationvia otp page for successful account registeration
        } else {
          setIsError(true);
          console.log("Login failed!"); // Handle failed signup with an appropriate message
        }
      })
      .catch((err) => {
        setIsError(true);
        console.log(err);
      })
    //       setSession({
    //         id: id,
    //         status: true,
    //       })
    //       axios.post("http://localhost:5000/auth/create-session", {id: id, startTime: formattedDate})
    //       .then((res) => {
    //         localStorage.setItem('session', session);
    //         localStorage.setItem('session', id);
    //         console.log(res.data);
    //       })
    //       .catch((err) => {
    //         console.log("error", err);
    //       });
    // }
    }
  }

  // const handleOtpChange = (e) => {
  //   const value = e.target;
  //   setOtp(otp*10 + value);
  // }

  return (
  <>
      <div className='User-upper'>
      <Navbar/>
        <div className="wrapper">
          <div className="title-text">
            <div className={`title ${isLogin ? 'login' : 'signup'}`}>{isLogin ? 'Login Form' : 'Signup Form'}</div>
          </div>
          <div className="form-container">
            <div className="slide-controls">
              <input type="radio" name="slide" id="login" checked={isLogin} onChange={switchToLogin} />
              <input type="radio" name="slide" id="signup" checked={!isLogin} onChange={switchToSignup} />
              <label htmlFor="login" className="slide login">Login</label>
              <label htmlFor="signup" className="slide signup">Signup</label>
              <div className="slider-tab"></div>
            </div>
            <div className="form-inner">
              {isLogin ? (
                <form className="login" onSubmit={handleSubmit}>
                  <div className="field">
                    <input type="text" placeholder="Type Email Address / Username" name="name" onChange={handleInputChange} required />
                  </div>
                  <div className="field">
                    <input type="password" placeholder="Password" name="password" onChange={handleInputChange} required />
                  </div>
                  <div className="pass-link"><a href="#">Forgot password?</a></div>
                  <div className="field btn">
                    <div className="btn-layer"></div>
                    <button type="submit">Login</button>
                  </div>
                  <div className="signup-link">Not a member? <a href="#" onClick={switchToSignup}>Signup now</a></div>
                </form>
              ) : (
                <form className="signup" onSubmit={handleSubmit}>
                  {isError ? (
                    <div className="field err">
                      <span className='err'>Invalid Email</span>
                    </div>
                  ) : (
                    <></>
                  )}
                  
                  <div className="field">
                    <input type="text" placeholder="User Name" name="userName" onChange={handleInputChange} required />
                  </div>
                  <div className="field">
                    <input type="email" placeholder="Email Address" name="email" onChange={handleInputChange} required />
                  </div>
                  <div className="field">
                    <input type="password" placeholder="Password" name="password" onChange={handleInputChange} required />
                  </div>
                  <div className="field">
                    <input type="password" placeholder="Confirm password" name="cfp" onChange={handleInputChange} required />
                  </div>
                  <div className="field btn">
                    <div className="btn-layer"></div>
                    <button type="submit">Signup</button>
                  </div>
                  {/* <Modal className='otpheader' show={show} fullscreen={fullscreen} onHide={() => setShow(false)} backdrop="static" keyboard={false}>
                    <Modal.Header style={{background: "transparent"}}>
                      <AuthNav/>
                    </Modal.Header>
                    <Modal.Body>
                      <div>
                        <h1>Enter the OTP</h1>
                        <br></br>
                        <br></br>
                        <br></br>
                        <input type='text' name='otp1' onChange={handleOtpChange} required />
                        <input type='text' name='otp2' onChange={handleOtpChange} required />
                        <input type='text' name='otp3' onChange={handleOtpChange} required />
                        <input type='text' name='otp4' onChange={handleOtpChange} required />
                        <input type='text' name='otp5' onChange={handleOtpChange} required />
                        <input type='text' name='otp6' onChange={handleOtpChange} required />
                      </div>

                    <button type="submit">Validate OTP</button>
                    </Modal.Body>
                  </Modal> */}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default User;
