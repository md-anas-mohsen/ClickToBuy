/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from 'react'
import { MDBDataTableV5 } from 'mdbreact'
import {
  CAlert,
  CBadge,
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
import { clearErrors, allOrders, deleteOrder } from 'src/actions/orderActions'
import CIcon from '@coreui/icons-react'
import { useHistory } from 'react-router-dom'
import Metadata from 'src/reusable/Metadata'
import { DELETE_ORDER_RESET, DELIVERED, IN_TRANSIT, PROCESSING } from 'src/constants/orderConstants'

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

const AllOrders = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const { error: orderError, orders, loading: loadingOrders } = useSelector((state) => state.orders)
  const { loading, error, isDeleted } = useSelector((state) => state.order)

  const [rows, setRows] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    if (!toDelete || isDeleted) {
      dispatch(allOrders())
    }
    if (orderError) {
      setAlert({ type: 'danger', message: orderError })
      dispatch(clearErrors())
    }
    if (error) {
      setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (isDeleted) {
      setAlert({ type: 'success', message: `Order ${toDelete} successfully deleted` })
      dispatch({ type: DELETE_ORDER_RESET })
    }
  }, [dispatch, orderError, error, isDeleted, toDelete])

  useEffect(() => {
    const showDelete = (orderID) => {
      setToDelete(orderID)
      setDeleteConfirm(true)
    }
    if (orders) {
      setRows(
        orders.map((order) => ({
          orderID: order.order_id,
          date: order.placed_on?.toString().slice(0, 10),
          cost: Number(order.total_price).toFixed(2),
          status:
            order.order_status === PROCESSING ? (
              <CBadge color="info">Processing</CBadge>
            ) : order.order_status === IN_TRANSIT ? (
              <CBadge color="warning">In Transit</CBadge>
            ) : (
              order.order_status === DELIVERED && <CBadge color="success">Delivered</CBadge>
            ),
          items: Number(order.order_items?.reduce((acc, item) => acc + Number(item.quantity), 0)),
          actions: (
            <>
              <CButton
                color="info"
                variant="ghost"
                size="sm"
                onClick={() => history.push(`/admin/orders/${order.order_id}`)}
              >
                <CIcon name="cil-settings" />
              </CButton>
              <CButton
                color="danger"
                variant="ghost"
                size="sm"
                onClick={() => showDelete(order.order_id)}
              >
                <CIcon name="cil-trash" />
              </CButton>
            </>
          ),
        })),
      )
    }
  }, [orders, history, dispatch])

  const handleDeleteOrder = (orderID) => {
    dispatch(deleteOrder(orderID))
    setDeleteConfirm(false)
  }

  const ConfirmDelete = () => {
    return (
      <CModal visible={deleteConfirm} onDismiss={() => setDeleteConfirm(false)}>
        <CModalHeader onDismiss={() => setDeleteConfirm(false)}>
          <CModalTitle>Delete Order</CModalTitle>
        </CModalHeader>
        <CModalBody>Are you sure you want to delete Order {toDelete}?</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setDeleteConfirm(false)}>
            Close
          </CButton>
          <CButton disabled={loading} color="danger" onClick={() => handleDeleteOrder(toDelete)}>
            Delete
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }

  const columns = [
    {
      label: 'Order ID',
      field: 'orderID',
      width: 250,
    },
    {
      label: 'Placed On',
      field: 'date',
      width: 100,
    },
    {
      label: 'Total Cost (Rs)',
      field: 'cost',
      width: 120,
    },
    {
      label: 'Total Items',
      field: 'items',
      sort: 'desc',
      width: 100,
    },
    {
      label: 'Status',
      field: 'status',
      sort: 'asc',
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
      <Metadata title="All Orders" />
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>All Orders</CCardHeader>
        <CCardBody>
          <ConfirmDelete />
          {!loadingOrders && orders ? (
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

export default AllOrders
