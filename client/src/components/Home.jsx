import React, { useState } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import useTripGuides from "../hooks/useTripGuides";
import DeleteModal from "./DeleteModal";
import { formattedDate, truncateContent, renderRatingStars } from "../common";

const Home = () => {
  const { tripGuides, deleteTripGuide } = useTripGuides();
  const { user } = useAuth0();
  const navigate = useNavigate();

  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [guideToDelete, setGuideToDelete] = useState(null);
  const handleDeleteClick = (guide) => {
    setGuideToDelete(guide);
    setDeleteModalShow(true);
  };

  const handleDeleteModalHide = () => {
    setDeleteModalShow(false);
  };

  const handleDelete = async () => {
    try {
      await deleteTripGuide(guideToDelete.id);
      handleDeleteModalHide();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="text-center">
          <Link to="/guide/create" className="btn btn-primary" aria-label="Create a new guide">
            Create New Guide
          </Link>
          {/* <Link to="/debugger" className="btn btn-primary"  aria-label="Debugger Page">
            Debugger
          </Link> */}
        </div>
      </div>
      <div className="container mt-4">
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {tripGuides.map((guide) => (
            <div key={guide.id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  {user && (user.sub === guide.guser.auth0Id) && (
                    <>
                      <button type="button" className="btn btn-sm float-end" aria-label="edit guide"
                        onClick={() => { navigate(`/guide/edit/${guide.id}`); }}>
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button type="button" className="btn btn-sm float-end me-2" aria-label="Delete guide"
                        onClick={() => handleDeleteClick(guide)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </>
                  )}

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
                    <strong>Rating:</strong> {renderRatingStars(guide.rating)}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Posted by {" "}
                      <a href={`/user/${guide.guser.id}`}
                        target="_self"
                        rel="noopener noreferrer"
                        className="custom-link-color">
                        {guide.guser.name}
                      </a> on {" "} {formattedDate(guide.createdAt)}
                    </small>
                    <button type="button" className="btn btn-primary" aria-label="view guide detail"
                      onClick={() => { navigate(`/guide/detail/${guide.id}`); }}>
                      Details
                    </button>
                  </div>
                  <hr />
                  <div>
                    <p className="text-sm">Comments({guide.comment.length}): </p>
                    <ul>
                      {guide.comment.slice(0, 3).map((comment) => (
                        <li key={comment.id} className="d-flex justify-content-between align-items-center">
                          <div>
                            {truncateContent(comment.content, 30)}
                          </div>
                          <div className="text-end">
                            <a href={`/user/${comment.cuser.id}`}
                              target="_self"
                              rel="noopener noreferrer"
                              className="custom-link-color">
                              {comment.cuser.name}
                            </a>
                            <small className="text-muted ms-2">
                              {formattedDate(comment.createdAt)}
                            </small>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div >
              </div >
            </div >
          ))}
        </div >
      </div >
      {deleteModalShow &&
        guideToDelete &&
        (
          <DeleteModal
            show={deleteModalShow}
            onHide={handleDeleteModalHide}
            onDelete={handleDelete}
            content={`Are you sure you want to delete "${guideToDelete.title}"?`}
          />
        )}
    </div >
  );
};

export default Home;
