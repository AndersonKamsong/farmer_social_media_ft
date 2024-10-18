import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import UserService from '../../services/UserService';

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountType: "user",
        // phone: "" // State for phone number
    });
    const [loading, setLoading] = useState(false);

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData({ ...data, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Check if passwords match
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            await UserService.register(data);
            toast.success("Account created successfully!");
            // Optionally redirect or perform other actions after successful signup
        } catch (error) {
            toast.error("Failed to create account. Please try again.");
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
                                    {/* <div>
                                        <a className="logo" href="index.html">
                                            <img className="img-fluid for-light" src={require("../assets/images/logo/logo.png")}
                                                alt="looginpage" />
                                            <img className="img-fluid for-dark m-auto" src={require("../assets/images/logo/dark-logo.png")}
                                                alt="logo" />
                                        </a>
                                    </div> */}
                                </div>
                                <div className="login-main">
                                    <form className="theme-form" onSubmit={handleSubmit}>
                                        <h2 className="text-center">Create your account</h2>
                                        <p className="text-center">Enter your personal details to create account</p>
                                        
                                        <div className="form-group">
                                            <label className="col-form-label pt-0">Your Name</label>
                                            <div className="row g-2">
                                                <div className="col-6">
                                                    <input className="form-control" type="text" name="firstName" required=""
                                                        placeholder="First name" onChange={handleChange} />
                                                </div>
                                                <div className="col-6">
                                                    <input className="form-control" type="text" name="lastName" required=""
                                                        placeholder="Last name" onChange={handleChange} />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="form-group">
                                            <label className="col-form-label">Email Address</label>
                                            <input className="form-control" type="email" name="email" required=""
                                                placeholder="Test@gmail.com" onChange={handleChange} />
                                        </div>

                                        {/* <div className="form-group">
                                            <label className="col-form-label">Phone Number</label>
                                            <input className="form-control" type="tel" name="phone" required=""
                                                placeholder="123-456-7890" onChange={handleChange} />
                                        </div> */}
                                        
                                        <div className="form-group">
                                            <label className="col-form-label">Password</label>
                                            <div className="form-input position-relative">
                                                <input className="form-control"
                                                    type={showPassword ? "text" : "password"} 
                                                    name="password" required=""
                                                    placeholder="*********" onChange={handleChange} />
                                                <div className="show-hide" onClick={handleShowPassword}>
                                                    <span className="">{showPassword ? 'Hide' : 'Show'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="col-form-label">Confirm Password</label>
                                            <div className="form-input position-relative">
                                                <input className="form-control"
                                                    type={showConfirmPassword ? "text" : "password"} 
                                                    name="confirmPassword" required=""
                                                    placeholder="*********" onChange={handleChange} />
                                                <div className="show-hide" onClick={handleShowConfirmPassword}>
                                                    <span className="">{showConfirmPassword ? 'Hide' : 'Show'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label className="col-form-label">Account Type</label>
                                            <select 
                                                className="form-control" 
                                                name="accountType" 
                                                value={data.accountType} 
                                                onChange={handleChange}
                                            >
                                                <option value="user">User</option>
                                                <option value="farmer">Farmer</option>
                                            </select>
                                        </div>
                                        
                                        <div className="form-group mb-0 checkbox-checked">
                                            <div className="form-check checkbox-solid-info">
                                                <input className="form-check-input" id="solid6" type="checkbox" />
                                                <label className="form-check-label" htmlFor="solid6">Agree with</label>
                                                <a className="ms-3 link" href="forget-password.html">Privacy Policy</a>
                                            </div>
                                            <button className="btn btn-primary btn-block w-100 mt-3" type="submit" disabled={loading}>
                                                {loading ? 'Creating Account...' : 'Create Account'}
                                            </button>
                                        </div>

                                        <div className="login-social-title">
                                            <h6>Or Sign in with </h6>
                                        </div>

                                        <div className="form-group">
                                            <ul className="login-social">
                                                <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"><i className="icon-linkedin"></i></a></li>
                                                <li><a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><i className="icon-twitter"></i></a></li>
                                                <li><a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer"><i className="icon-facebook"></i></a></li>
                                                <li><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><i className="icon-instagram"></i></a></li>
                                            </ul>
                                        </div>

                                        <p className="mt-4 mb-0 text-center">Already have an account?<a className="ms-2" href="/login">Sign in</a>
                                        </p>
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
