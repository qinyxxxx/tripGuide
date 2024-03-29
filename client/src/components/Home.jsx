import React from "react";
import Header from "./Header";
import { Link } from "react-router-dom";
import useTripGuides from "../hooks/useTripGuides";

const Home = () => {
    const { tripGuides } = useTripGuides();
    console.log(tripGuides);

    const formattedDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    };

    const truncateContent = (content, maxLength) => {
        if (content.length > maxLength) {
            return content.substring(0, maxLength) + "...";
        }
        return content;
    };

    return (
        <div>
            <Header className="fixed-top" />
            <div className="container mt-4">
                <div className="text-center">
                    <Link to="/create-guide" className="btn btn-primary">
                        Create New Guide
                    </Link>
                    <Link to="/debugger" className="btn btn-primary">
                        Debugger
                    </Link>
                </div>
            </div>
            <div className="container mt-4">
                <div className="row row-cols-1 row-cols-md-2 g-4">
                    {tripGuides.map((guide) => (
                        <div key={guide.id} className="col">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title text-center mb-3">{guide.title}</h5>
                                    <p className="card-text">
                                        <strong>Country:</strong> {guide.country}
                                    </p>
                                    <p className="card-text">
                                        <strong>City:</strong> {guide.city}
                                    </p>
                                    <p className="card-text">
                                        <strong>Days:</strong> {guide.duration}
                                    </p>
                                    <p className="card-text">
                                        <strong>Content:</strong>{" "}
                                        {truncateContent(guide.content, 200)}
                                    </p>
                                    <p className="card-text">
                                        <strong>Rating:</strong> {guide.rating}
                                    </p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <small className="text-muted">
                                            Posted by {guide.guser.name} on {" "} {formattedDate(guide.createdAt)}
                                        </small>
                                        <Link to={`/guide/${guide.id}`} className="btn btn-primary">
                                            View Details
                                        </Link>
                                    </div>
                                    <hr />
                                    <div>
                                        <h6>Comments({guide.comment.length}): </h6>
                                        <ul>
                                            {guide.comment.slice(0, 3).map((comment) => (
                                                <li key={comment.id} className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        {truncateContent(comment.content, 30)}
                                                    </div>
                                                    <div className="text-end">
                                                        <span>{comment.cuser.name}</span>
                                                        <small className="text-muted ms-2">
                                                            {formattedDate(comment.createdAt)}
                                                        </small>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
