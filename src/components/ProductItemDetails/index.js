import {Component} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusValues = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productsData: {},
    similarProducts: [],
    apiStatus: apiStatusValues.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProducts()
  }

  formattedData = data => ({
    availability: data.availability,
    brand: data.brand,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    description: data.description,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProducts = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({apiStatus: apiStatusValues.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = this.formattedData(data)
      const similarProductsData = data.similar_products.map(each =>
        this.formattedData(each),
      )

      this.setState({
        productsData: updatedData,
        similarProducts: similarProductsData,
        apiStatus: apiStatusValues.success,
      })
    } else {
      this.setState({apiStatus: apiStatusValues.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loading" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="80" />
    </div>
  )

  renderFailureView = () => (
    <div className="notFound">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="nfImg"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  onClickDecrement = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  onClickIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderProductsView = () => {
    const {productsData, similarProducts, quantity} = this.state
    const {
      availability,
      imageUrl,
      price,
      rating,
      brand,
      description,
      title,
      totalReviews,
    } = productsData

    return (
      <div className="productsView">
        <div className="topView">
          <img src={imageUrl} alt="product" className="viewImg" />
          <div className="details">
            <h1>{title}</h1>
            <p>
              <span className="highlight">Price: </span>
              {price}
            </p>
            <div className="review">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviewText">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p>
              <span className="highlight">Available:</span> {availability}
            </p>
            <p>
              <span className="highlight">Brand: </span>
              {brand}
            </p>
            <hr className="hr" />
            <div className="signs">
              <button
                type="button"
                className="signButton"
                data-testid="minus"
                onClick={this.onClickDecrement}
              >
                <BsDashSquare className="sign" />
              </button>
              <p>{quantity}</p>
              <button
                type="button"
                className="signButton"
                data-testid="plus"
                onClick={this.onClickIncrement}
              >
                <BsPlusSquare className="sign" />
              </button>
            </div>
            <button type="button" className="button">
              Add To Cart
            </button>
          </div>
        </div>
        <h1 className="smtext">Similar Items</h1>
        <ul className="bottomView">
          {similarProducts.map(product => (
            <SimilarProductItem details={product} key={product.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusValues.success:
        return this.renderProductsView()
      case apiStatusValues.failure:
        return this.renderFailureView()
      case apiStatusValues.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <Header />
        {this.renderProductDetails()}
      </div>
    )
  }
}
export default ProductItemDetails
