import { useState } from "react";
import { FaArrowLeft, FaArrowRight, FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { CiLock } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useSignUpForm } from "../utils/useSignUpForm";

function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
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
  } = useSignUpForm();

  const onSubmit = async (e) => {
    setIsSubmitting(true);
    await handleSubmit(e);
    setIsSubmitting(false);
    
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex items-center justify-center mx-auto h-full gap-8">
        <div className="w-full md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <FaArrowLeft className="size-9 w-9" />
            <p className="text-2xl font-bold leading-tight tracking-tight text-center">
              Getting Started!
            </p>
            <p className="font-bold leading-tight tracking-tight">
              Create an account
            </p>
            <div className="flex flex-row gap-4">
              <div className="relative w-1/2">
                <input
                  placeholder="Name"
                  className={`bg-white border sm:text-sm block w-full pl-10 p-2 ${errors.name ? 'border-red-500' : 'border-black'} input-placeholder-black-bold text-black font-semibold`}
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <p className="text-red-500 text-sm mt-3">{errors.name}</p>}
              </div>
              <div className="relative w-1/2">
                <input
                  placeholder="Mobile Number"
                  className={`bg-white border sm:text-sm block w-full pl-10 p-2 ${errors.mobile ? 'border-red-500' : 'border-black'} input-placeholder-black-bold text-black font-semibold`}
                  id="mobile"
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
                {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile}</p>}
              </div>
            </div>
            <div className="flex flex-row gap-4">
              <div className="relative w-1/2">
                <input
                  placeholder="Company"
                  className={`bg-white border sm:text-sm block w-full pl-10 p-2 ${errors.company ? 'border-red-500' : 'border-black'} input-placeholder-black-bold text-black font-semibold`}
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
              </div>
              <div className="relative w-1/2">
                <input
                  placeholder="Email"
                  className={`bg-white border sm:text-sm block w-full pl-10 p-2 ${errors.email ? 'border-red-500' : 'border-black'} input-placeholder-black-bold text-black font-semibold`}
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <TfiEmail className="absolute left-3 top-5 transform -translate-y-1/2 text-black font-semibold size-5" />
                {errors.email && <p className="text-red-500 text-sm mt-3">{errors.email}</p>}
              </div>
            </div>
            <div className="relative">
              <input
                placeholder="Username"
                className={`bg-white border sm:text-sm block w-full pl-10 p-2 ${errors.username ? 'border-red-500' : 'border-black'} input-placeholder-black-bold text-black font-semibold`}
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
            </div>
            <div className="relative text-black">
              <input
                className={`bg-white border sm:text-sm block w-full pl-10 p-2 ${errors.password ? 'border-red-500' : 'border-black'} input-placeholder-black-bold text-black font-semibold`}
                placeholder="Password"
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <CiLock className="absolute left-3 top-5 transform -translate-y-1/2 text-black font-semibold size-6" />
              <div
                className="absolute right-3 top-5 transform -translate-y-1/2 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div className="relative text-black">
              <select
                className={`bg-white border sm:text-sm block w-full pl-10 p-4 ${errors.role ? 'border-red-500' : 'border-black'} input-placeholder-black-bold text-black font-semibold custom-select`}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="employee" className="font-bold p-3">Employee</option>
                <option value="admin" className="font-bold p-3 m-2">Admin</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>
            {role === "admin" && (
              <div className="relative text-black">
                <input
                  className={`bg-white border sm:text-sm block w-full pl-10 p-4 ${errors.inviteCode ? 'border-red-500' : 'border-black'} input-placeholder-black-bold text-black font-semibold`}
                  placeholder="Invite Code"
                  id="inviteCode"
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
                {errors.inviteCode && <p className="text-red-500 text-sm">{errors.inviteCode}</p>}
              </div>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 mt-6 px-4 py-2 bg-yellow-500 rounded-full hover:bg-yellow-600 font-semibold justify-center w-full"
              disabled={isSubmitting}
            >
              <span className="ml-auto text-lg">{isSubmitting ? "Submitting..." : "Sign Up"}</span>
              <FaArrowRight className="border p-2 bg-white rounded-full w-12 h-12 text-right ml-auto border-black" />
            </button>
            {/* <p className="font-bold text-center">Or continue with</p> */}
            {/* <div className="flex gap-12 justify-center">
              <button
                type="button"
                className="text-2xl border p-2 bg-white rounded-full w-12 h-12 shadow-lg shadow-indigo-500/40"
              >
                <FcGoogle />
              </button>
              <button
                type="button"
                className="text-2xl border p-2 bg-white rounded-full w-12 h-12 text-center shadow-lg shadow-indigo-500/40"
              >
                <FaGithub />
              </button>
            </div> */}
            <p className="font-bold mt-8 text-center">
              Already have an Account?
              <Link
                to="/login"
                className="text-sm text-blue-800 hover:underline mt-4 font-bold"
              >
                SIGN IN
              </Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

export default SignUp;
