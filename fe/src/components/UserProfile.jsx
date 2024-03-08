import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, meApi } from '../utils/api'; // Assuming this is where updateUser function is defined
import { FaEdit, FaMapMarkerAlt, FaEnvelope } from 'react-icons/fa';
import Modal from '../utils/Modal';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';


const UserProfile = () => {
    const user = useSelector(state => state.loginReducer.user);
    const [updatedUser, setUpdatedUser] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [editMode, setEditMode] = useState(false);
    const dispatch = useDispatch();


    const getUserData = useCallback(async () => {
        try {

            const response = await meApi();
            setUpdatedUser(response.data);

        } catch (error) {
            console.error('Error getting user:', error);
        }
    }, []);

    // State to manage form inputs
    const [formData, setFormData] = useState({
        address: user.address,
        bio: user.bio,
        facebook: user.facebook,
        instagram: user.instagram,
        linkedin: user.linkedin,
        twitter: user.twitter
    });


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedFormData = { ...formData, id: user._id };
            await updateUser(updatedFormData);
            dispatch({ type: 'UPDATE_USER', payload: formData });
            setEditMode(false);
            setSuccessMessage('Profile updated successfully!');
            getUserData();
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (error) {
            console.error('Error updating user:', error);

        }
    };

    useEffect(() => {
        getUserData();
    }, [getUserData]);


    return user && user._id ? (
        <>
            <div className="bg-white shadow-md rounded-lg p-6 mt-4 relative">
                <div className="flex items-center mb-4">
                    <div
                        className="w-10 h-10 rounded-full mr-2 flex items-center justify-center text-white bg-blue-700"
                        style={{ fontWeight: 'bold', fontSize: '1.5rem', color: 'white' }}
                    >
                        {user.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">{user.userName}</h2>
                        <p className="text-gray-600">{updatedUser.bio}</p>
                    </div>
                    <div className="absolute bottom-5 right-5">
                        <FaEdit className="ml-auto cursor-pointer" onClick={() => setEditMode(true)} />
                    </div>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mt-4">
                <div className="flex items-center mb-4">
                    <div>
                        <div className="flex items-center">
                            <FaMapMarkerAlt className="mr-2 text-gray-400" />
                            <h2 className="text-lg font-semibold">{updatedUser.address}</h2>
                        </div>
                        <div className="flex items-center mt-2">
                            <FaEnvelope className="mr-2 text-gray-400" />
                            <p className="text-gray-600">{updatedUser.email}</p>
                        </div>
                        <div className="flex  mt-5">
                            <a href={updatedUser.social?.facebook} target="_blank" rel="noopener noreferrer"><FaFacebook className="mr-5 cursor-pointer text-blue-500 hover:text-blue-700" size={24} /></a>
                            <a href={updatedUser.social?.instagram} target="_blank" rel="noopener noreferrer"><FaInstagram className="mr-5 cursor-pointer text-pink-500 hover:text-pink-700" size={24} /></a>
                            <a href={updatedUser.social?.twitter} target="_blank" rel="noopener noreferrer"><FaTwitter className="mr-5 cursor-pointer text-blue-400 hover:text-blue-600" size={24} /></a>
                            <a href={updatedUser.social?.linkedin} target="_blank" rel="noopener noreferrer"><FaLinkedin className="mr-5 cursor-pointer text-blue-700 hover:text-blue-900" size={24} /></a>
                        </div>
                    </div>

                </div>
            </div>


            <Modal isOpen={editMode} onClose={() => setEditMode(false)}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', width: '400px' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '20px' }}>Edit Profile</h2>
                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px' }}>

                        <div>
                            <label htmlFor="address">Address:</label>
                            <input type="text" id="address" name="address" placeholder='Update Address' value={formData.address} onChange={handleChange} style={{ width: '100%' }} className="border border-gray-300 rounded-md px-4 py-2 w-full" />
                        </div>
                        <div>
                            <label htmlFor="bio">Bio:</label>
                            <input type="text" id="bio" name="bio" value={formData.bio} placeholder='Update Bio'  onChange={handleChange} style={{ width: '100%' }} className="border border-gray-300 rounded-md px-4 py-2 w-full" />
                        </div>
                        <div>
                            <label htmlFor="facebook">Facebook:</label>
                            <input type="text" id="facebook" name="facebook" value={formData.facebook} placeholder='Update Facebook Page'  onChange={handleChange} style={{ width: '100%' }} className="border border-gray-300 rounded-md px-4 py-2 w-full" />
                        </div>
                        <div>
                            <label htmlFor="instagram">Instagram:</label>
                            <input type="text" id="instagram" name="instagram" value={formData.instagram} placeholder='Update Instagram Page'  onChange={handleChange} style={{ width: '100%' }} className="border border-gray-300 rounded-md px-4 py-2 w-full" />
                        </div>
                        <div>
                            <label htmlFor="twitter">Twitter:</label>
                            <input type="text" id="twitter" name="twitter" value={formData.twitter} placeholder='Update Twitter Page'  onChange={handleChange} style={{ width: '100%' }} className="border border-gray-300 rounded-md px-4 py-2 w-full" />
                        </div>
                        <div>
                            <label htmlFor="linkedin">LinkedIn:</label>
                            <input type="text" id="linkedin" name="linkedin" value={formData.linkedin} placeholder='Update Linkedin' onChange={handleChange} style={{ width: '100%' }} className="border border-gray-300 rounded-md px-4 py-2 w-full" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
                            <button type="button" onClick={() => setEditMode(false)} style={{ padding: '10px', backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Cancel</button>
                            <button type="submit" style={{ padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Save</button>
                        </div>
                    </form>
                </div>
            </Modal>
            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4" role="alert">
                    <span className="block sm:inline">{successMessage}</span>
                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                        <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" onClick={() => setSuccessMessage('')}>
                            <title>Close</title>
                            <path fillRule="evenodd" d="M2.646 2.646a.5.5 0 0 1 .708 0L10 9.293l6.646-6.647a.5.5 0 0 1 .708.708L10.707 10l6.647 6.646a.5.5 0 0 1-.708.708L10 10.707l-6.646 6.647a.5.5 0 0 1-.708-.708L9.293 10 2.646 3.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </span>
                </div>
            )}

        </>
    ) : null;
};

export default UserProfile;
