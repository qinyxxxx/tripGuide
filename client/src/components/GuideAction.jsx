import React, { useState, useEffect } from "react";
import Header from "./Header";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import useTripGuides from "../hooks/useTripGuides";

const GuideAction = () => {
  const { id } = useParams();
  const { useSingleGuide, createTripGuide, updateTripGuide } = useTripGuides();
  const navigate = useNavigate();
  const location = useLocation();
  const action = location.pathname.split("/")[2];

  const [formData, setFormData] = useState({
    title: "",
    country: "",
    city: "",
    duration: "",
    rating: "",
    cost: "",
    content: ""
  });

  const singleGuide = useSingleGuide(id);

  useEffect(() => {
    if (singleGuide && action === 'edit') {
      setFormData({
        title: singleGuide.title,
        country: singleGuide.country,
        city: singleGuide.city,
        duration: singleGuide.duration,
        rating: singleGuide.rating,
        cost: singleGuide.cost,
        content: singleGuide.content
      });
    }
  }, [singleGuide, action]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const handleAction = async () => {
      try {
        const newGuide = {
          title: formData.title,
          country: formData.country,
          city: formData.city,
          duration: parseInt(formData.duration),
          rating: parseInt(formData.rating),
          cost: parseFloat(formData.cost),
          content: formData.content
        }
        const res = action === 'edit' ? await updateTripGuide(id, newGuide) : await createTripGuide(newGuide);

        navigate(`/guide/detail/${res.id}`);
      } catch (error) {
        console.log(error);
      }
    };
    handleAction();
  };

  const handleRatingChange = (e) => {
    setFormData((prevFormData) => ({ ...prevFormData, rating: e.target.value }));
  };

  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body">
                {/* <button className="btn btn-link" onClick={navigate(-1)} style={{ position: 'absolute', top: '10px', left: '10px' }}>
                  Back
                </button> */}

                {action === "create" ? (
                  <h3 className="card-title text-center mb-4">Create New Post</h3>
                ) : (
                  <h3 className="card-title text-center mb-4">Edit Post</h3>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label htmlFor="country" className="form-label">Country</label>
                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="city" className="form-label">City</label>
                      <input
                        type="text"
                        className="form-control"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="row mb-3">
                    <div className="col">
                      <label htmlFor="duration" className="form-label">Days</label>
                      <input
                        type="number"
                        className="form-control"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col">
                      <label htmlFor="rating" className="form-label">Rating</label>
                      <select
                        className="form-select"
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleRatingChange}
                        required
                      >
                        <option value="">Select Rating</option>
                        {[1, 2, 3, 4, 5].map((value) => (
                          <option key={value} value={value}>{value}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label htmlFor="cost" className="form-label">Cost</label>
                      <input
                        type="number"
                        className="form-control"
                        id="cost"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="content" className="form-label">Content</label>
                    <textarea
                      className="form-control"
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows={10}
                      required
                    ></textarea>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary">Submit</button>
                    {/* <Link to="/" className="btn btn-link ms-2">Cancel</Link> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuideAction;
