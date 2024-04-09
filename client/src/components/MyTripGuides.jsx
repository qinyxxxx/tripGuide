import React, { useState, useEffect } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import useTripGuides from "../hooks/useTripGuides";
import DeleteModal from "./DeleteModal";
import { formattedDate, truncateContent } from "../common";

const MyTripGuides = () => {
  const { myGuides, deleteTripGuide } = useTripGuides();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <Header className="fixed-top" />
      <div className="container mt-4">
        <div className="text-center">
          <Link to="/guide/create" className="btn btn-primary" aria-label="Create a new guide">
            Create New Guide
          </Link>
        </div>
      </div>
      <div className="container mt-4">
        <div className="row row-cols-1 row-cols-md-2 g-4">
          {myGuides.map((guide) => (
            <div key={guide.id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  {user && (user.sub === guide.guser.auth0Id) && (
                    <>
                      {guide.isPrivate ? (<i className="bi bi-lock-fill float-start"></i>) : (<i className="bi bi-unlock float-start"></i>)}
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
                    <strong>Rating:</strong> {guide.rating}
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
                    <h6>Comments({guide.comment.length}): </h6>
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
                            {/* <span>{comment.cuser.name}</span> */}
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

export default MyTripGuides;
