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

const renderRatingStars = (rating) => {
  const maxRating = 5;

  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(<span key={`full-${i}`}>&#9733;</span>);
  }
  for (let i = rating; i < maxRating; i++) {
    stars.push(<span key={`empty-${i}`}>&#9734;</span>);
  }

  return stars;
};

export { formattedDate, truncateContent, renderRatingStars };
