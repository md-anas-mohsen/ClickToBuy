/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CFormCheck,
  CFormControl,
  CFormLabel,
  CSpinner,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, getProducts } from 'src/actions/productActions'
import { useHistory } from 'react-router-dom'
import Metadata from 'src/reusable/Metadata'
import Table from 'src/reusable/Table'
import { getCategoryDetails, updateCategory } from 'src/actions/categoryActions'
import { UPDATE_CATEGORY_RESET } from 'src/constants/categoryConstants'

const EditCategory = ({ match }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const categoryId = match.params.id
  const [title, setTitle] = useState('')

  const { error: productsError, products, loading } = useSelector((state) => state.products)
  const { category, products: productsInCategory } = useSelector((state) => state.categoryDetails)
  const { success, message, error } = useSelector((state) => state.category)

  const [rows, setRows] = useState(null)
  const [categoryName, setCategoryName] = useState('')
  const [discount, setDiscount] = useState(0)
  const [alert, setAlert] = useState(null)
  const [categoryProducts, setCategoryProducts] = useState([])

  useEffect(() => {
    dispatch(getCategoryDetails(categoryId))
  }, [dispatch, categoryId, success])

  useEffect(() => {
    dispatch(getProducts())
    if (productsError) {
      setAlert({ type: 'danger', message: productsError })
      dispatch(clearErrors())
    }
    if (error) {
      setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (success) {
      setAlert({ type: 'success', message: message })
      dispatch({ type: UPDATE_CATEGORY_RESET })
    }
  }, [dispatch, error, productsError, success, message])

  useEffect(() => {
    if (category) {
      setTitle(category.category_name)
      setCategoryName(category.category_name)
      setDiscount(category.discount)
      const prodInCategory = productsInCategory.map((product) => product.product_id)
      //   setCategoryProducts(productsInCategory.map((product) => product.product_id))
      setCategoryProducts(
        products.map((product) => {
          if (prodInCategory.indexOf(product.product_id) !== -1)
            return { product_id: product.product_id, included: true }
          return { product_id: product.product_id, included: false }
        }),
      )
    }
  }, [category, products, productsInCategory])

  useEffect(() => {
    const addOrRemoveProduct = (index, included) => {
      if (included) {
        setCategoryProducts([
          ...categoryProducts.slice(0, index),
          { ...categoryProducts[index], included },
          ...categoryProducts.slice(index + 1),
        ])
      } else {
        setCategoryProducts([
          ...categoryProducts.slice(0, index),
          { ...categoryProducts[index], included: false },
          ...categoryProducts.slice(index + 1),
        ])
      }
    }

    if (products) {
      setRows(
        products.map((product, index) => ({
          productID: product.product_id,
          name: product.name,
          include: (
            <>
              <CFormCheck
                onChange={(e) => addOrRemoveProduct(index, e.target.checked)}
                checked={categoryProducts.length > 0 && categoryProducts[index].included}
                productId={product.product_id}
                id={product.product_id}
              />
            </>
          ),
        })),
      )
    }
  }, [products, history, dispatch, title, categoryProducts])

  const columns = [
    {
      label: 'Product ID',
      field: 'productID',
      width: 100,
    },
    {
      label: 'Name',
      field: 'name',
      width: 270,
      attributes: {
        'aria-controls': 'DataTable',
        'aria-label': 'Name',
      },
    },
    {
      label: 'Include',
      field: 'include',
      sort: 'disabled',
      width: 150,
    },
  ]

  const handleSave = () => {
    let includedProducts = []
    categoryProducts.forEach(
      (product) => product.included && includedProducts.push(product.product_id),
    )
    //   formData.set('category_name', categoryName);
    let formData = {}
    formData.product_ids = includedProducts
    formData.category_name = categoryName
    formData.discount = discount
    dispatch(updateCategory(categoryId, formData))
  }

  return (
    <>
      <Metadata title={title} />
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>{`Update Category`}</CCardHeader>
        <CCardBody>
          {!loading && products ? (
            <>
              <CFormLabel>Category Name</CFormLabel>
              <CFormControl
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                id="category_name"
                placeholder="Category Name"
                className="mb-4 mx-2 w-75"
              />
              <CFormLabel>Discount on products (0.x)</CFormLabel>
              <CFormControl
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                id="discount"
                placeholder="Discount % (0.x)"
                className="mb-4 mx-2 w-75"
              />
              <Table columns={columns} rows={rows} />
              <CButton onClick={handleSave}>{!loading ? 'Save' : 'Saving...'}</CButton>
            </>
          ) : (
            <center>
              <CSpinner color="primary" size="xl" />
            </center>
          )}
        </CCardBody>
      </CCard>
    </>
  )
}

export default EditCategory
