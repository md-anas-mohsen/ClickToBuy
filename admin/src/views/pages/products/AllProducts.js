/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import { MDBDataTableV5 } from 'mdbreact'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CSpinner,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, deleteProduct, getProducts } from 'src/actions/productActions'
import CIcon from '@coreui/icons-react'
import { DELETE_PRODUCT_RESET } from 'src/constants/productConstants'
import { useHistory } from 'react-router-dom'
import Metadata from 'src/reusable/Metadata'

// eslint-disable-next-line react/prop-types
const Table = ({ columns, rows }) => {
  return (
    <MDBDataTableV5
      searchTop
      searchBottom={false}
      scrollX
      hover
      entriesOptions={[5, 20, 25]}
      entries={5}
      pagesAmount={4}
      data={{
        columns: columns,
        rows: rows,
      }}
    />
  )
}

const AllProducts = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const page = window.location.pathname.split('/')[3]
  let firstWord = page.split('-')[0]
  let secondWord = page.split('-')[1]
  firstWord = firstWord.charAt(0).toUpperCase() + firstWord.toLowerCase().slice(1)
  secondWord = secondWord.charAt(0).toUpperCase() + secondWord.toLowerCase().slice(1)
  const title = `${firstWord} ${secondWord}`

  const {
    error: productsError,
    products,
    loading: loadingProducts,
  } = useSelector((state) => state.products)
  const { error, isDeleted, loading } = useSelector((state) => state.product)

  const [rows, setRows] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [productName, setProductName] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    dispatch(getProducts())
    if (productsError) {
      console.log(productsError)
      setAlert({ type: 'danger', message: productsError })
      dispatch(clearErrors())
    }
    if (error) {
      console.log(error)
      setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (isDeleted) {
      setAlert({ type: 'success', message: `${productName} deleted successfully` })
      dispatch({ type: DELETE_PRODUCT_RESET })
    }
  }, [dispatch, error, productsError, isDeleted, productName])

  useEffect(() => {
    const showDelete = (productID, productName) => {
      setToDelete(productID)
      setProductName(productName)
      setDeleteConfirm(true)
    }
    if (products) {
      setRows(
        products.map((product) => ({
          productID: product.product_id,
          name: product.name,
          ratings: product.ratings,
          stock: Number(product.stock),
          actions:
            title === 'All Products' ? (
              <>
                <CButton
                  color="info"
                  variant="ghost"
                  size="sm"
                  onClick={() => history.push(`/admin/products/${product.product_id}`)}
                >
                  <CIcon name="cil-pencil" />
                </CButton>
                <CButton
                  color="danger"
                  variant="ghost"
                  size="sm"
                  onClick={() => showDelete(product.product_id, product.name)}
                >
                  <CIcon name="cil-trash" />
                </CButton>
              </>
            ) : (
              title === 'Product Reviews' && (
                <CButton
                  color="info"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    history.push(`/admin/products/product-reviews/${product.product_id}`)
                  }
                >
                  <i className="far fa-eye"></i>
                </CButton>
              )
            ),
        })),
      )
    }
  }, [products, history, dispatch, title])

  const handleDeleteProduct = (productID) => {
    dispatch(deleteProduct(productID))
    setDeleteConfirm(false)
  }

  const ConfirmDelete = () => {
    return (
      <CModal visible={deleteConfirm} onDismiss={() => setDeleteConfirm(false)}>
        <CModalHeader onDismiss={() => setDeleteConfirm(false)}>
          <CModalTitle>Delete Product</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete {productName}?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteConfirm(false)}>
            Close
          </CButton>
          <CButton disabled={loading} color="danger" onClick={() => handleDeleteProduct(toDelete)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

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
      label: title === 'All Products' ? 'Stock' : title === 'Product Reviews' && 'Ratings',
      field: title === 'All Products' ? 'stock' : title === 'Product Reviews' && 'ratings',
      width: 100,
    },
    {
      label: 'Actions',
      field: 'actions',
      sort: 'disabled',
      width: 150,
    },
  ]

  return (
    <>
      <Metadata title={title} />
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>{title}</CCardHeader>
        <CCardBody>
          <ConfirmDelete />
          {!loading && !loadingProducts && products ? (
            <Table columns={columns} rows={rows} />
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

export default AllProducts
