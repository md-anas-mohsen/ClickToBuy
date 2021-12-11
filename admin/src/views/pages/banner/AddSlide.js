/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormControl,
  CFormLabel,
  CFormSelect,
  CSpinner,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { ADD_BANNER_SLIDE_RESET } from 'src/constants/productConstants'
import Metadata from 'src/reusable/Metadata'
import { addBannerSlide, getProducts, clearErrors } from 'src/actions/productActions'
import { getCategories } from 'src/actions/categoryActions'

const AddSlide = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { loading, error, success } = useSelector((state) => state.newSlide)
  const { error: productsError, products } = useSelector((state) => state.products)
  const { error: categoriesError, categories } = useSelector((state) => state.categories)

  const [alert, setAlert] = useState(null)
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [category, setCategory] = useState(null)
  const [useCategory, setUseCategory] = useState(null)
  const [product, setProduct] = useState(null)

  useEffect(() => {
    if (error) {
      if (error === "Cannot read property 'length' of undefined")
        setAlert({ type: 'danger', message: 'Please add an image' })
      else setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (productsError) {
      setAlert({ type: 'danger', message: productsError })
      dispatch(clearErrors())
    }
    if (categoriesError) {
      setAlert({ type: 'danger', message: categoriesError })
      dispatch(clearErrors())
    }
    if (success) {
      setAlert({ type: 'success', message: 'Slide Added Successfully' })
      dispatch({ type: ADD_BANNER_SLIDE_RESET })
    }
  }, [dispatch, error, success, history, productsError, categoriesError])

  useEffect(() => {
    dispatch(getCategories())
    dispatch(getProducts())
  }, [])

  const handleChange = (e) => {
    const file = e.target.files[0]
    setImage('')
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.set('bannerTitle', title)
    formData.set('bannerDescription', description)
    formData.set('image', image)

    if (useCategory) {
      formData.set('categoryId', category)
    } else {
      formData.set('productId', product)
    }

    dispatch(addBannerSlide(formData))
  }

  return (
    <>
      <Metadata title="Add Slide" />
      <CCard className="mb-4">
        <CCardHeader>Add Slide</CCardHeader>
        <CCardBody>
          <CForm className="row g-3" onSubmit={handleSubmit}>
            <CCol md="12">
              <CFormLabel htmlFor="inputEmail4">Slide Title</CFormLabel>
              <CFormControl
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                id="slide-title"
              />
            </CCol>
            <CCol xs="12">
              <CFormLabel htmlFor="productDescription">Slide Description</CFormLabel>
              <CFormControl
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                component="textarea"
                id="slide-description"
                rows="5"
              ></CFormControl>
            </CCol>
            <fieldset className="row my-3">
              <legend className="col-form-label col-sm-2 pt-0">Link the banner to a</legend>
              <CCol xs="12">
                <CFormCheck
                  type="radio"
                  name="gridRadios"
                  id="gridRadios1"
                  label="Category"
                  defaultChecked={useCategory}
                  onChange={(e) => setUseCategory(true)}
                />
                <CFormCheck
                  type="radio"
                  name="gridRadios"
                  id="gridRadios2"
                  label="Product"
                  defaultChecked={!useCategory}
                  onChange={(e) => setUseCategory(false)}
                />
              </CCol>
            </fieldset>
            <CCol xs="12">
              {useCategory ? (
                <CFormSelect
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  id="category"
                >
                  <option value="" disabled selected hidden>
                    Choose Category
                  </option>
                  {categories.map((category, i) => (
                    <option key={i} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))}
                </CFormSelect>
              ) : (
                <CFormSelect
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  id="product"
                >
                  <option value="" disabled selected hidden>
                    Choose Product
                  </option>
                  {products.map((product, i) => (
                    <option key={i} value={product.product_id}>
                      {product.name}
                    </option>
                  ))}
                </CFormSelect>
              )}
            </CCol>
            <CCol xs="12">
              <CFormLabel htmlFor="productImages">Image</CFormLabel>
              <CFormControl onChange={handleChange} type="file" id="product-image" />
            </CCol>
            <CCol xs="12">
              <center>
                {image !== '' && (
                  <img
                    style={{ objectFit: 'contain', width: '300px', height: '300px' }}
                    src={image}
                    alt=""
                  ></img>
                )}
              </center>
            </CCol>
            <CCol xs="12">
              <CButton disabled={loading || (!category && !product)} type="submit">
                {!loading ? (
                  'Add Slide'
                ) : (
                  <>
                    <CSpinner component="span" size="sm" aria-hidden="true" />
                    Adding Slide...
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

export default AddSlide
