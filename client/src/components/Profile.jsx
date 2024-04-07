import React, { useState, useEffect } from "react";
import Header from "./Header";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, isLoading, updateUserProfile] = useUser();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    gender: '',
    birthDate: '',
    introduction: ''
  });

  useEffect(() => {
    if (!isLoading && user) {
      setFormData({
        gender: user.gender || 'Prefer not to say',
        birthDate: user.birthDate || '',
        introduction: user.introduction || ''
      });
    } else if (!isLoading && !user) {
      navigate('/login');
    }
  }, [user, isLoading, setFormData, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = {
      gender: formData.gender,
      birthDate: formData.birthDate,
      introduction: formData.introduction,
    };
    updateUserProfile(updatedUser)
      .then(() => {
        setShowModal(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div><Header></Header>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">Profile</h3>
                <div className="mb-3">
                  <strong>Name:</strong> {user.name}
                </div>
                <div className="mb-3">
                  <strong>Email:</strong> {user.email}
                </div>
                <div className="mb-3">
                  <strong>Gender:</strong> {user.gender || "Not specified"}
                </div>
                <div className="mb-3">
                  <strong>Birth Date:</strong> {user.birthDate || "Not specified"}
                </div>
                <div className="mb-3">
                  <strong>Introduction:</strong> {user.introduction || "Not provided"}
                </div>
                <div className="text-center">
                  <button className="btn btn-primary" onClick={handleShow}>Edit Profile</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal "
        id="profileModal"
        tabIndex={-1}
        aria-labelledby="profileModalLabel"
        aria-hidden="true"
        style={{ display: showModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="profileModalLabel">Edit Profile</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label><strong>Name:</strong></label>
                  <p className="form-control-plaintext">{user.name}</p>
                </div>
                <div className="mb-3">
                  <label><strong>Email:</strong></label>
                  <p className="form-control-plaintext">{user.email}</p>
                </div>
                <div className="mb-3">
                  <label htmlFor="gender">Gender:</label>
                  <select
                    className="form-control"
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="birthDate"><strong>Birth Date</strong></label>
                  <input
                    type="date"
                    className="form-control"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="introduction"><strong>Introduction</strong></label>
                  <textarea
                    className="form-control"
                    id="introduction"
                    name="introduction"
                    value={formData.introduction}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleClose}>
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
