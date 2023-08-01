import './index.css'

const SimilarProductsItem = props => {
  const {details} = props
  const {imageUrl, price, rating, brand, title} = details

  return (
    <li className="similarItem">
      <img src={imageUrl} alt="similar product" className="similarImg" />
      <h1 className="thead">{title}</h1>
      <p className="description">by {brand}</p>
      <div className="ratingContainer">
        <p className="highlight">RS {price}/- </p>
        <div className="rating-container">
          <p className="rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProductsItem
