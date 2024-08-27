import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const useSignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [inviteCode, setInviteCode] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!email || !/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Valid email is required.";
    if (!mobile || !/^\d{10}$/.test(mobile))
      newErrors.mobile = "Valid mobile number is required.";
    if (!company) newErrors.company = "Company is required.";
    if (!username) newErrors.username = "Username is required.";
    if (!password) newErrors.password = "Password is required.";
    if (role === "admin") {
      if (!inviteCode) {
        newErrors.inviteCode = "Invite code is required for admin.";
      } else if (inviteCode !== "3456") {
        newErrors.inviteCode = "Invalid invite code.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const userData = {
        name,
        email,
        company,
        mobile,
        username,
        password,
        role,
        // inviteCode: role === "admin" ? inviteCode : undefined,
      };

      try {
        const response = await axios.post(
          "http://localhost:5001/api/users/register/",
          userData
        );
        // Store isAdmin in local storage
        // localStorage.setItem("isAdmin", role === "admin" ? "true" : "false");
        navigate("/login");

      } catch (error) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
        } else if (error.request) {
          console.error("Error request data:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
        alert(
          "Failed to register user. Please check the console for more details."
        );
      }
    }
  };

  return {
    showPassword,
    togglePasswordVisibility,
    name,
    setName,
    email,
    setEmail,
    company,
    setCompany,
    mobile,
    setMobile,
    username,
    setUsername,
    password,
    setPassword,
    role,
    setRole,
    inviteCode,
    setInviteCode,
    errors,
    handleSubmit,
  };
};
