import React, { useEffect, useState } from "react";
import Header from "./Header";
import useUser from "../hooks/useUser";
import { useParams } from "react-router-dom";

const UserInfo = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const { getUserById } = useUser();


  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserById(id);
      setUser(userData);
    };

    fetchUserData();
  }, [id, getUserById]);

  if (!user) {
    return <div>User not found.</div>;
  }

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow">
              <div className="card-body">
                <button onClick={() => window.history.back()} className="btn float-start" aria-label="go back">
                  <i className="bi bi-arrow-left"></i>
                </button>
                <h3 className="card-title text-center mb-4">User Info</h3>
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

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
