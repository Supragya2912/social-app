import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerApi } from '../utils/api';
import { FiEye, FiEyeOff } from 'react-icons/fi'; // Import icons

const Register = () => {
    const [formData, setFormData] = useState({
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false // Added terms and conditions checkbox state
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for toggling confirm password visibility
    const navigate = useNavigate();

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
      
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    }, [formData]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.agreeTerms) {
            setError('Please agree to the terms and conditions');
            return;
        }

        try {
            const response = await registerApi(formData);

            // Simulate sending welcome email notification
            simulateWelcomeEmail(formData.email);

            localStorage.setItem('token', response.data.token);
            setError('');
            navigate('/login');
        } catch (e) {
            if (e.response.status === 400) {
                setError(e.response.data.message);
                return;
            }
        }
    }, [formData, navigate]);

    const simulateWelcomeEmail = (email) => {
        console.log(`Welcome email sent to ${email}`);

    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto max-w-sm">
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="mb-4">
                <label htmlFor="userName" className="block mb-1">Username</label>
                <input type="text" id="userName" name="userName" placeholder="Enter your username" value={formData.userName} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-2 w-full" />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block mb-1">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-2 w-full" />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block mb-1">Password</label>
                <div className="relative">
                    <input type={showPassword ? "text" : "password"} id="password" name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-2 w-full pr-10" />
                    <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 px-3 py-2 focus:outline-none">
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="confirmPassword" className="block mb-1">Confirm Password</label>
                <div className="relative">
                    <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} className="border border-gray-300 rounded-md px-4 py-2 w-full pr-10" />
                    <button type="button" onClick={toggleConfirmPasswordVisibility} className="absolute inset-y-0 right-0 px-3 py-2 focus:outline-none">
                        {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                </div>
            </div>
            <div className="mb-4">
                <label htmlFor="agreeTerms" className="block mb-1">
                    <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} className="mr-2" />
                    I agree to the terms and conditions
                </label>
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Register</button>
        </form>
    );
};

export default Register;
