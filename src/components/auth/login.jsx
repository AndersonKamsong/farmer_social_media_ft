import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import UserService from '../../services/UserService';

export default function Login() {
    const [data, setData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async () => {
        console.log(data);
        if (data.email === '' || data.password === '') {
            toast("Enter all values");
            return;
        }

        setLoading(true);
        try {
            const response = await UserService.login(data.email, data.password);
            toast.success("Login successful!");
            console.log(response); // Handle successful login (e.g., store token, user data)
            navigate('/'); // Redirect to the dashboard or appropriate page
        } catch (error) {
            toast.error(`Login failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <ToastContainer limit={3} />
            <div className="container-fluid p-0">
                <div className="row m-0">
                    <div className="col-12 p-0">
                        <div className="login-card login-dark">
                            <div>
                                <div>
                                    {/* <div className="logo">
                                        <img className="img-fluid for-light" src={require("../../assets/images/logo/logo-login.png")}
                                            alt="looginpage" />
                                        <img className="img-fluid for-dark m-auto" src={require("../../assets/images/logo/dark-login-logo.png")}
                                            alt="logo" />
                                    </div> */}
                                </div>
                                <div className="login-main">
                                    <form className="theme-form">
                                        <h2 className="text-center">Sign in to account</h2>
                                        <p className="text-center">Enter your email &amp; password to login</p>
                                        <div className="form-group">
                                            <label className="col-form-label">Email Address</label>
                                            <input className="form-control" type="email" required=""
                                                placeholder="Test@gmail.com"
                                                onChange={(e) => { setData({ ...data, email: e.target.value }) }} />
                                        </div>
                                        <div className="form-group">
                                            <label className="col-form-label">Password</label>
                                            <div className="form-input position-relative">
                                                <input className="form-control"
                                                    type={showPassword ? "text" : "password"}
                                                    name="login[password]" required=""
                                                    placeholder="*********"
                                                    onChange={(e) => { setData({ ...data, password: e.target.value }) }} />
                                                <div className="show-hide" onClick={handleShowPassword}>
                                                    <span className="">{showPassword ? 'Hide' : 'Show'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group mb-0 checkbox-checked">
                                            <div className="form-check checkbox-solid-info">
                                                <input className="form-check-input" id="solid6" type="checkbox" />
                                                <label className="form-check-label" htmlFor="solid6">Remember password</label>
                                                {/* implement after deployment */}
                                            </div>
                                            <a className="link-two" onClick={() => { navigate("/forgot-password") }}>Forgot password?</a>
                                            <div className="text-end mt-3">
                                                {loading ? (
                                                    <a className="btn btn-primary btn-block w-100 text-white">
                                                        <div className='sbt-btn-loader' style={{ height: "20px", width: "20px", margin: "0 auto" }}></div>
                                                    </a>
                                                ) : (
                                                    <a className="btn btn-primary btn-block w-100 text-white"
                                                        onClick={handleSubmit}>Sign in
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        <div className="login-social-title">
                                            <h6></h6>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
