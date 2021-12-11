/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import { MDBDataTableV5 } from 'mdbreact'
import {
  CAlert,
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCarousel,
  CCarouselItem,
  CCol,
  CForm,
  CFormCheck,
  CFormControl,
  CFormLabel,
  CFormSelect,
  CSpinner,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getProducts, newProduct } from 'src/actions/productActions'
import CIcon from '@coreui/icons-react'
import { useHistory } from 'react-router-dom'
import { NEW_PRODUCT_RESET } from 'src/constants/productConstants'
import Metadata from 'src/reusable/Metadata'

const AddProduct = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { loading, error, success } = useSelector((state) => state.newProduct)

  const [alert, setAlert] = useState(null)
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [stock, setStock] = useState(0)
  const [seller, setSeller] = useState('')
  const [images, setImages] = useState([])
  const [imagesPreview, setImagesPreview] = useState([])

  const Categories = [
    'Electronics',
    'Cameras',
    'Computers',
    'Phones',
    'Consoles',
    'Accessories',
    'Books',
    'Apparel',
    'Footwear',
    'Sports',
    'Home',
  ]

  useEffect(() => {
    if (error) {
      if (error === "Cannot read property 'length' of undefined")
        setAlert({ type: 'danger', message: 'Please add at least one image' })
      else setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (success) {
      setAlert({ type: 'success', message: 'Product Added Successfully' })
      dispatch({ type: NEW_PRODUCT_RESET })
    }
  }, [dispatch, error, success, history])

  const handleChange = (e) => {
    const files = Array.from(e.target.files)
    setImagesPreview([])
    setImages([])

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((prev) => [...prev, reader.result])
          setImages((prev) => [...prev, reader.result])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.set('name', name)
    formData.set('price', price)
    formData.set('description', description)
    formData.set('stock', stock)

    images.forEach((image) => {
      formData.append('images', image)
    })

    dispatch(newProduct(formData))
  }

  return (
    <>
      <Metadata title="Add Product" />
      <CCard className="mb-4">
        <CCardHeader>Add Product</CCardHeader>
        <CCardBody>
          <CForm className="row g-3" onSubmit={handleSubmit}>
            <CCol md="12">
              <CFormLabel htmlFor="inputEmail4">Product Name</CFormLabel>
              <CFormControl
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="product-name"
              />
            </CCol>
            <CCol xs="12">
              <CFormLabel htmlFor="productDescription">Product Description</CFormLabel>
              <CFormControl
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                component="textarea"
                id="product-description"
                rows="5"
              ></CFormControl>
            </CCol>
            <CCol xs="6">
              <CFormLabel htmlFor="productStock">Stock</CFormLabel>
              <CFormControl
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                id="productStock"
                type="number"
              />
            </CCol>
            <CCol xs="6">
              <CFormLabel htmlFor="productPrice">Price (Rs)</CFormLabel>
              <CFormControl
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                id="productPrice"
                type="number"
              />
            </CCol>
            {/* <CCol xs="6" md="4">
              <CFormLabel htmlFor="productSeller">Seller</CFormLabel>
              <CFormControl
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                id="productSeller"
              />
            </CCol>
            <CCol xs="12">
              <CFormLabel htmlFor="category">Category</CFormLabel>
              <CFormSelect
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                id="category"
              >
                <option value="" disabled selected hidden>
                  Choose...
                </option>
                {Categories.map((category, i) => (
                  <option key={i} value={category}>
                    {category}
                  </option>
                ))}
              </CFormSelect>
            </CCol> */}
            <CCol xs="12">
              <CFormLabel htmlFor="productImages">Images</CFormLabel>
              <CFormControl onChange={handleChange} type="file" id="productImages" multiple />
            </CCol>
            <CCol xs="12">
              <center>
                {imagesPreview.length > 1 ? (
                  <CCarousel interval={false} indicators dark>
                    {imagesPreview.map((image, i) => (
                      <CCarouselItem key={i}>
                        <img
                          style={{ objectFit: 'contain', width: '300px', height: '300px' }}
                          src={image}
                          alt={`slide ${i + 1}`}
                        ></img>
                      </CCarouselItem>
                    ))}
                  </CCarousel>
                ) : (
                  imagesPreview.length === 1 && (
                    <img
                      style={{ objectFit: 'contain', width: '300px', height: '300px' }}
                      src={imagesPreview[0]}
                      alt=""
                    ></img>
                  )
                )}
              </center>
            </CCol>
            <CCol xs="12">
              <CButton disabled={loading} type="submit">
                {!loading ? (
                  'Add Product'
                ) : (
                  <>
                    <CSpinner component="span" size="sm" aria-hidden="true" />
                    Adding Product...
                  </>
                )}
              </CButton>
            </CCol>
            <CCol xs="12">{alert && <CAlert color={alert.type}>{alert.message}</CAlert>}</CCol>
          </CForm>
        </CCardBody>
      </CCard>
    </>
  )
}

export default AddProduct
