import React from "react";
import Header from "./Header";

const About = () => {
  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body">
                <h2 className="card-title text-center mb-4">Welcome to Trip Guides</h2>
                <p className="card-text">
                  Trip Guides is your passport to a world of adventures! Share your travel guides and tips with fellow explorers, rate destinations, keep a private diary, and connect with a global community of travelers.
                </p>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <i className="bi bi-globe mr-2"></i> Share travel guides and tips
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-star mr-2"></i> Rate top travel destinations
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-lock mr-2"></i> Keep private travel diaries
                  </li>
                  <li className="list-group-item">
                    <i className="bi bi-chat-dots mr-2"></i> Engage with fellow travelers
                  </li>
                </ul>
                <p className="card-text mt-4">
                  Join Trip Guides today to start exploring and sharing your travel experiences! Your next adventure begins here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
