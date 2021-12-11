/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormControl,
  CFormLabel,
  CSpinner,
} from '@coreui/react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { newCategory } from 'src/actions/categoryActions'
import { clearErrors } from 'src/actions/userActions'
import { NEW_CATEGORY_RESET } from 'src/constants/categoryConstants'

const AddCategory = () => {
  const dispatch = useDispatch()

  const [categoryName, setCategoryName] = useState('')

  const { loading, success } = useSelector((state) => state.newCategory)

  useEffect(() => {
    if (success) {
      dispatch({ type: NEW_CATEGORY_RESET })
    }
  }, [dispatch, success])

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.set('category_name', categoryName)
    console.log(formData)
    dispatch(newCategory(formData))
  }

  return (
    <>
      <CForm className="row g-3 p-3" onSubmit={handleSubmit}>
        <CCol xs={7} md={8}>
          <CFormControl
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            id="category_name"
            placeholder="Category Name"
          />
        </CCol>
        <CCol xs={5} md={4}>
          <CButton className="btn-block" disabled={loading} type="submit">
            {!loading ? (
              'Add Category'
            ) : (
              <>
                <CSpinner component="span" size="sm" aria-hidden="true" />
                Adding Category...
              </>
            )}
          </CButton>
        </CCol>
        {/* <CCol xs="12">{alert && <CAlert color={alert.type}>{alert.message}</CAlert>}</CCol> */}
      </CForm>
    </>
  )
}

export default AddCategory
