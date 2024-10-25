// import React, { useState } from "react";
// import "../login/Login.css";
// import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
// import googleIcon from "../assets/images/googleIcon.webp";
// import facebookIcon from "../assets/images/facebookIcon.webp";
// import appleIcon from "../assets/images/appleIcon.webp";
// import axios from "axios";

// const Login = () => {
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const navigate = useNavigate(); // Initialize navigate

//   // Toggle Password visibility
//   const handleShowPassword = () => {
//     setShowPassword((prevShowPassword) => !prevShowPassword);
//   };

//   // Handle password input change
//   const handlePasswordChange = (e) => {
//     setPassword(e.target.value);
//   };

//   // Form validation function
//   const validateForm = () => {
//     const newError = {};
//     if (!email) {
//       newError.email = "Email is Required";
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       newError.email = "Invalid Email";
//     }
//     if (!password) {
//       newError.password = "Password is Required";
//     } else if (password.length < 6) {
//       newError.passwordLen = "Password must be at least 6 characters";
//     }
//     setError(newError);
//     return Object.keys(newError).length === 0;
//   };

//   // Handle login form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       try {
//         const result = await axios.post("http://localhost:5000/api/auth/register", {
//           email,
//           password,
//         });

//         console.log(result.data);
//         setSuccess("User login successful!");

//         // Save login flag in localStorage
//         localStorage.setItem("isAuthenticated", "true");

//         // Clear form fields and errors
//         setEmail("");
//         setPassword("");
//         setError("");

//         // Redirect to home page
//         navigate("/home");
//         console.log("Navigating to home page...");
//       } catch (err) {
//         console.error("Login Failed", err);
//         if (err.response && err.response.status === 404) {
//           setError("User not found");
//         } else if (err.response && err.response.status === 401) {
//           setError("Invalid password");
//         } else {
//           setError("Failed to Login. Please try again.");
//         }
//       }
//     }
//   };

//   return (
//     <div className="loginWrapper">
//       <h1>Login here</h1>
//       <p className="loginWrapperPara">Welcome back you’ve been missed!</p>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="inputField"
//           placeholder="Email"
//         />
//         {error.email && <p style={{ color: "red" }}>{error.email}</p>}

//         <input
//           type={showPassword ? "text" : "password"}
//           value={password}
//           onChange={handlePasswordChange}
//           className="inputField passField"
//           placeholder="Password"
//         />
//         {error.password && <p style={{ color: "red" }}>{error.password}</p>}

//         <button type="submit" className="loginSignInBtn">Sign in</button>

//         <input
//           type="checkbox"
//           id="show-password"
//           checked={showPassword}
//           onChange={handleShowPassword}
//         />
//         <label htmlFor="show-password" className="labelShowPass">
//           Show Password
//         </label>

//         {error && <p className="errorMessage">{error}</p>}
//         {success && <p className="successMessage">{success}</p>}
//       </form>

//       <a className="forgetPassLink" href="##">Forgot your password?</a>
//       <Link className="newAccountLink" to="/register">
//         Create new account
//       </Link>

//       <p className="otherOptions">Or continue with</p>
//       <div className="otherOptionsIcons">
//         <a href="##">
//           <img src={googleIcon} alt="google icon" />
//         </a>
//         <a href="##">
//           <img src={facebookIcon} alt="facebook icon" />
//         </a>
//         <a href="##">
//           <img src={appleIcon} alt="apple icon" />
//         </a>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import "../login/Login.css";
import { Link, useNavigate } from "react-router-dom";
import googleIcon from "../assets/images/googleIcon.webp";
import facebookIcon from "../assets/images/facebookIcon.webp";
import appleIcon from "../assets/images/appleIcon.webp";
import { useAuth } from "../context/AuthContext"; // Import useAuth to use the auth context

const Login = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(""); 
  const [passwordError, setPasswordError] = useState(""); 
  const [loginError, setLoginError] = useState(""); 
  const [success, setSuccess] = useState("");

  const { login } = useAuth(); // Destructure login from useAuth
  const navigate = useNavigate(); // Initialize navigate

  // Toggle Password visibility
  const handleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Invalid Email");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 2) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        // Use login from AuthContext instead of making direct axios request
        await login(email, password); 

        setSuccess("User login successful!");

        // Clear form fields and errors
        setEmail("");
        setPassword("");
        setEmailError("");
        setPasswordError("");
        setLoginError("");

        // Redirect to home page after successful login
        navigate("/home");
      } catch (err) {
        console.error("Login Failed", err);
        setLoginError("Failed to login. Please check your email and password.");
      }
    }
  };

  return (
    <div className="loginWrapper">
      <h1>Login here</h1>
      <p className="loginWrapperPara">Welcome back you’ve been missed!</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="inputField"
          placeholder="Email"
        />
        {emailError && <p style={{ color: "red" }}>{emailError}</p>} {/* Email error */}

        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="inputField passField"
          placeholder="Password"
        />
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>} {/* Password error */}

        <button type="submit" className="loginSignInBtn">Sign in</button>

        <input
          type="checkbox"
          id="show-password"
          checked={showPassword}
          onChange={handleShowPassword}
        />
        <label htmlFor="show-password" className="labelShowPass">
          Show Password
        </label>

        {loginError && <p style={{ color: "red" }}>{loginError}</p>} {/* Login error */}
        {success && <p className="successMessage">{success}</p>} {/* Success message */}
      </form>

      <a className="forgetPassLink" href="##">Forgot your password?</a>
      <Link className="newAccountLink" to="/register">
        Create new account
      </Link>

      <p className="otherOptions">Or continue with</p>
      <div className="otherOptionsIcons">
        <a href="##">
          <img src={googleIcon} alt="google icon" />
        </a>
        <a href="##">
          <img src={facebookIcon} alt="facebook icon" />
        </a>
        <a href="##">
          <img src={appleIcon} alt="apple icon" />
        </a>
      </div>
    </div>
  );
};

export default Login;
