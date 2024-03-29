import React, { useState } from "react";
import Header from "./Header";
import { useAuth0 } from "@auth0/auth0-react";
import { Link, useParams } from "react-router-dom";
import useTripGuides from "../hooks/useTripGuides";
import useComments from "../hooks/useComments";

const GuideDetail = () => {
  const { user } = useAuth0();
  const { id } = useParams();
  const { useSingleGuide } = useTripGuides();
  const guide = useSingleGuide(id);
  const { comments, createComment } = useComments(id);
  const [newCommentContent, setNewCommentContent] = useState("");

  if (!guide || !user) { // todo bug
    return <div>Loading...</div>;
  }

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}`;
  };

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
            {user.sub === guide.guser.auth0Id && (
              <Link to={`/guide/edit/${id}`} className="btn btn-primary btn-sm float-end">
                Edit
              </Link>
            )}
            <h2 className="card-title text-center">{guide.title}</h2>

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
              <strong>Content:</strong> {guide.content}
            </p>
            <p className="card-text">
              <strong>Rating:</strong> {guide.rating}
            </p>
            <div className="d-flex">
              <small>
                Posted by {guide.guser.name} on {formattedDate(guide.createdAt)}
              </small>
            </div>
            <hr />
            <div>
              <h6>Comments({comments.length}):</h6>
              <ul>
                {comments.map((comment) => (
                  <li key={comment.id}>
                    <div>{comment.content}</div>
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
            {/* <hr /> */}
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
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideDetail;
