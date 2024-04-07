import React, { useState, useEffect } from "react";
import Header from "./Header";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useTripGuides from "../hooks/useTripGuides";
import useCountryCity from "../hooks/useCountryCity";
import { useAuth0 } from "@auth0/auth0-react";


const GuideAction = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [navigate, user]);

  const { id } = useParams();
  const { useSingleGuide, createTripGuide, updateTripGuide } = useTripGuides();
  const location = useLocation();
  const action = location.pathname.split("/")[2];

  const [formData, setFormData] = useState({
    title: "",
    country: "",
    city: "",
    duration: "",
    rating: "",
    cost: "",
    content: "",
    isPrivate: true,
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
        content: singleGuide.content,
        isPrivate: singleGuide.isPrivate,
      });
    }
  }, [singleGuide, action]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === 'isPrivate') {
      setFormData((prevFormData) => ({ ...prevFormData, isPrivate: checked }));
    } else if (name === 'rating') {
      setFormData((prevFormData) => ({ ...prevFormData, rating: e.target.value }));
    } else {
      setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }
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
          content: formData.content,
          isPrivate: formData.isPrivate
        }
        const { success, data } = action === 'edit' ? await updateTripGuide(id, newGuide) : await createTripGuide(newGuide);
        if (success) {
          navigate(`/guide/detail/${data.id}`);
        }
      } catch (error) {
        console.error(error);
      }
    };
    handleAction();
  };

  const { countries, getCities } = useCountryCity();

  const [cities, setCities] = useState([]);
  const handleCountryChange = (e) => {
    setCities([]);
    const countryIso = e.target.value;
    if (countryIso) {
      setFormData((prevFormData) => ({ ...prevFormData, country: countryIso }));
      getCities(countryIso).then((citiesData) => {
        setCities(citiesData);
      });
    }

  };


  return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow">
              <div className="card-body">
                <button onClick={() => window.history.back()} className="btn float-start"><i className="bi bi-arrow-left"></i></button>
                {action === "create" ? (
                  <h3 className="card-title text-center mb-4">Create New Post</h3>
                ) : (
                  <h3 className="card-title text-center mb-4">Edit My Post</h3>
                )}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label><span className="required">*</span>
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
                      <label htmlFor="country" className="form-label">Country</label><span className="required">*</span>
                      <select
                        className="form-control"
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleCountryChange}
                        required
                      >
                        <option value="">Select a country</option>
                        {countries.map(country => (
                          <option key={country.iso2} value={country.iso2}>
                            {/* todo 有bug，想让数据库存name，但是又想拿到iso */}
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col">
                      <label htmlFor="city" className="form-label">City</label>
                      <select
                        className="form-control"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={(e) => setFormData((prevFormData) => ({ ...prevFormData, city: e.target.value }))}
                      >
                        <option value="">Select a city</option>
                        {cities.map(city => (
                          <option key={city.name} value={city.name}>
                            {city.name}
                          </option>
                        ))}
                      </select>
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
                      <label htmlFor="rating" className="form-label">Rating</label><span className="required">*</span>
                      <select
                        className="form-select"
                        id="rating"
                        name="rating"
                        value={formData.rating}
                        onChange={handleChange}
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
                    <label htmlFor="content" className="form-label">Content</label><span className="required">*</span>
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
                  <div className="mb-3 form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isPrivate"
                      name="isPrivate"
                      checked={formData.isPrivate}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="isPrivate">
                      Make this post private
                    </label>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="btn btn-primary">Submit</button>
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
