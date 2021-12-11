/* eslint-disable prettier/prettier */
import CIcon from '@coreui/icons-react'
import {
  CAlert,
  CAvatar,
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
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { clearErrors, deleteUser, getUsers } from 'src/actions/userActions'
import { DELETE_USER_RESET, NO_AVATAR } from 'src/constants/userConstants'
import Metadata from 'src/reusable/Metadata'
import Table from 'src/reusable/Table'

const AllUsers = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { error, users, loading } = useSelector((state) => state.users)
  const { loading: loadingUser, error: userError, isDeleted } = useSelector((state) => state.user)

  const [rows, setRows] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [userName, setUserName] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if ((!toDelete && !userName) || isDeleted) {
      dispatch(getUsers())
    }
    if (error) {
      setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (userError) {
      setAlert({ type: 'danger', message: userError })
      dispatch(clearErrors())
    }
    if (isDeleted) {
      setAlert({ type: 'success', message: `${userName} ID: ${toDelete} successfully deleted` })
      dispatch({ type: DELETE_USER_RESET })
    }
  }, [dispatch, error, userError, isDeleted, userName, toDelete])

  useEffect(() => {
    const showDelete = (userID, name) => {
      setToDelete(userID)
      setUserName(name)
      setDeleteConfirm(true)
    }
    if (users) {
      setRows(
        users.map((user) => ({
          userID: user.user_id,
          role: user.role,
          name: user.full_name,
          createdAt: user.created_at.toString().slice(0, 10),
          email: user.email,
          avatar: (
            <CAvatar
              shape="rounded-circle"
              color="secondary"
              textColor="white"
              src={user.avatar_url !== NO_AVATAR && user.avatar_url}
            >
              {user.avatar_url === NO_AVATAR && user.full_name.slice(0, 1)}
            </CAvatar>
          ),
          actions: (
            <>
              <CButton
                color="info"
                variant="ghost"
                size="sm"
                onClick={() => history.push(`/admin/users/${user.user_id}`)}
              >
                <CIcon name="cil-pencil" />
              </CButton>
              <CButton
                color="danger"
                variant="ghost"
                size="sm"
                onClick={() => showDelete(user.user_id, user.full_name)}
              >
                <CIcon name="cil-trash" />
              </CButton>
            </>
          ),
        })),
      )
    }
  }, [users, history, dispatch])

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id))
    setDeleteConfirm(false)
  }

  const ConfirmDelete = () => {
    return (
      <CModal visible={deleteConfirm} onDismiss={() => setDeleteConfirm(false)}>
        <CModalHeader onDismiss={() => setDeleteConfirm(false)}>
          <CModalTitle>Delete User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete User: {userName} ID: {toDelete}?
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteConfirm(false)}>
            Close
          </CButton>
          <CButton disabled={loadingUser} color="danger" onClick={() => handleDeleteUser(toDelete)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  const columns = [
    {
      label: 'Avatar',
      field: 'avatar',
      width: 100,
    },
    {
      label: 'Name',
      field: 'name',
      width: 150,
    },
    {
      label: 'User ID',
      field: 'userID',
      width: 220,
    },
    {
      label: 'Role',
      field: 'role',
      sort: 'asc',
      width: 100,
    },
    {
      label: 'Email',
      field: 'email',
      width: 200,
    },
    {
      label: 'Joined',
      field: 'createdAt',
      sort: 'desc',
      width: 100,
    },
    {
      label: 'Actions',
      field: 'actions',
      sort: 'disabled',
      width: 100,
    },
  ]

  return (
    <>
      <Metadata title="All Users" />
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>All Users</CCardHeader>
        <CCardBody>
          <ConfirmDelete />
          {!loading && users ? (
            <Table columns={columns} rows={rows} scrollY />
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

export default AllUsers
