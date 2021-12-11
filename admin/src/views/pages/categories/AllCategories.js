/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
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
import { clearErrors, deleteCategory, getCategories } from 'src/actions/categoryActions'
import CIcon from '@coreui/icons-react'
import { DELETE_CATEGORY_RESET } from 'src/constants/categoryConstants'
import { useHistory } from 'react-router-dom'
import Metadata from 'src/reusable/Metadata'
import Table from 'src/reusable/Table'
import AddCategory from './AddCategory'

const AllCategories = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const page = window.location.pathname.split('/')[3]
  let firstWord = page.split('-')[0]
  let secondWord = page.split('-')[1]
  firstWord = firstWord.charAt(0).toUpperCase() + firstWord.toLowerCase().slice(1)
  secondWord = secondWord.charAt(0).toUpperCase() + secondWord.toLowerCase().slice(1)
  const title = `${firstWord} ${secondWord}`

  const { error, categories, loading } = useSelector((state) => state.categories)
  const { success, message, error: newCategoryError } = useSelector((state) => state.newCategory)
  const { error: categoryError, isDeleted } = useSelector((state) => state.category)

  const [rows, setRows] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [categoryName, setCategoryName] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    dispatch(getCategories())
    if (error) {
      setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }

    if (newCategoryError) {
      setAlert({ type: 'danger', message: newCategoryError })
      dispatch(clearErrors())
    }

    if (categoryError) {
      setAlert({ type: 'danger', message: categoryError })
      dispatch(clearErrors())
    }

    if (success) {
      setAlert({ type: 'success', message: message })
    }

    if (isDeleted) {
      setAlert({ type: 'success', message: `Category deleted successfully` })
      dispatch({ type: DELETE_CATEGORY_RESET })
    }
  }, [dispatch, error, success, message, newCategoryError, categoryError, isDeleted])

  useEffect(() => {
    const showDelete = (categoryID, categoryName) => {
      setToDelete(categoryID)
      setCategoryName(categoryName)
      setDeleteConfirm(true)
    }
    if (categories) {
      setRows(
        categories.map((category) => ({
          categoryID: category.category_id,
          name: category.category_name,
          user: category.user?.email,
          discount: `${category.discount * 100}%`,
          actions: (
            <>
              <CButton
                color="info"
                variant="ghost"
                size="sm"
                onClick={() => history.push(`/admin/categories/${category.category_id}`)}
              >
                <CIcon name="cil-pencil" />
              </CButton>
              <CButton
                color="danger"
                variant="ghost"
                size="sm"
                onClick={() => showDelete(category.category_id, category.category_name)}
              >
                <CIcon name="cil-trash" />
              </CButton>
            </>
          ),
        })),
      )
    }
  }, [categories, history, dispatch])

  const handleDeleteCategory = (categoryID) => {
    dispatch(deleteCategory(categoryID))
    setDeleteConfirm(false)
  }

  const ConfirmDelete = () => {
    return (
      <CModal visible={deleteConfirm} onDismiss={() => setDeleteConfirm(false)}>
        <CModalHeader onDismiss={() => setDeleteConfirm(false)}>
          <CModalTitle>Delete Category</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete {categoryName}?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteConfirm(false)}>
            Close
          </CButton>
          <CButton disabled={loading} color="danger" onClick={() => handleDeleteCategory(toDelete)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  const columns = [
    {
      label: 'Category ID',
      field: 'categoryID',
      width: 200,
    },
    {
      label: 'Name',
      field: 'name',
      width: 200,
      attributes: {
        'aria-controls': 'DataTable',
        'aria-label': 'Name',
      },
    },
    {
      label: 'Discount',
      field: 'discount',
      width: 100,
    },
    {
      label: 'Updated By',
      field: 'user',
    },
    {
      label: 'Actions',
      field: 'actions',
      sort: 'disabled',
    },
  ]

  return (
    <>
      <Metadata title={title} />
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>{title}</CCardHeader>
        <AddCategory />
        <CCardBody>
          <ConfirmDelete />
          {!loading && categories ? (
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

export default AllCategories
