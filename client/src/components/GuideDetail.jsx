import React, { useState } from "react";
import Header from "./Header";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, useParams } from "react-router-dom";
import useTripGuides from "../hooks/useTripGuides";
import useComments from "../hooks/useComments";
import DeleteModal from "./DeleteModal";
import { formattedDate, renderRatingStars } from "../common";


const GuideDetail = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const { id } = useParams();
  const { useSingleGuide, deleteTripGuide } = useTripGuides();
  const guide = useSingleGuide(id);
  const { comments, createComment } = useComments(id);
  const [newCommentContent, setNewCommentContent] = useState("");

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
      window.history.back();
    } catch (error) {
      console.error(error);
    }
  };

  if (!guide) {
    return <div>Loading...</div>;
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newCommentContent.trim()) {
      return;
    }
    try {
      await createComment({ content: newCommentContent });
      setNewCommentContent("");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="card">
          <div className="card-body">
            {user && user.sub === guide.guser.auth0Id && (
              <>
                <button type="button" className="btn btn-primary float-end" aria-label="delete guide"
                  onClick={() => handleDeleteClick(guide)}>
                  Delete
                </button>
                <button type="button" className="btn btn-primary float-end me-2" aria-label="edit guide"
                  onClick={() => { navigate(`/guide/edit/${id}`); }}>
                  Edit
                </button>
              </>
            )}
            <button onClick={() => { navigate('/'); }} className="btn float-start" aria-label="go back">
              <i className="bi bi-arrow-left"></i>
            </button>
            <h2 className="card-title text-center">{guide.isPrivate ? (<i className="bi bi-lock-fill fs-5"></i>) : (<i className="bi bi-unlock fs-5"></i>)} {guide.title}</h2>
            <p className="card-text">
              <strong>Country:</strong> {guide.country}
            </p>
            <p className="card-text">
              <strong>City:</strong> {guide.city}
            </p>
            <p className="card-text">
              <strong>Rating:</strong> {renderRatingStars(guide.rating)}
            </p>
            <p className="card-text">
              <strong>Cost:</strong> ${guide.cost}
            </p>
            <p className="card-text">
              <strong>Days:</strong> {guide.duration}
            </p>
            <p className="card-text">
              <strong>Content:</strong> {guide.content}
            </p>
            <div className="d-flex justify-content-end">
              <small>
                Posted by{" "}
                <a href={`/user/${guide.guser.id}`}
                  target="_self"
                  rel="noopener noreferrer"
                  className="custom-link-color">
                  {guide.guser.name}
                </a> on {formattedDate(guide.createdAt)}
              </small>
            </div>
            <hr />
            <div>
              <p className="text-sm">Comments ({comments.length}):</p>
              <ul>
                {comments.map((comment) => (
                  <li key={comment.id}>
                    <div>{comment.content}</div>
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
            {user && (
              <div>
                <form onSubmit={handleSubmitComment}>
                  <div className="mb-3">
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Enter your comment"
                      value={newCommentContent}
                      onChange={e => setNewCommentContent(e.target.value)}
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" aria-label="submit comment">
                    Submit
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
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
    </div>
  );
};

export default GuideDetail;
