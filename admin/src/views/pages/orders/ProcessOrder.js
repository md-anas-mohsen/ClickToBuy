/* eslint-disable prettier/prettier */
/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */

import React, { useEffect, useState } from 'react'
import {
  CAlert,
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardText,
  CCol,
  CForm,
  CFormLabel,
  CFormSelect,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors, allOrders, getOrderDetails, processOrder } from 'src/actions/orderActions'
import CIcon from '@coreui/icons-react'
import { DELIVERED, IN_TRANSIT, PROCESSING, UPDATE_ORDER_RESET } from 'src/constants/orderConstants'
import { useHistory } from 'react-router-dom'
import Metadata from 'src/reusable/Metadata'
import Table from 'src/reusable/Table'

const ProcessOrder = ({ match }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const orderID = match.params.id

  const { error, order, loading } = useSelector((state) => state.orderDetails)
  const {
    error: updateError,
    isUpdated,
    loading: loadingOrder,
  } = useSelector((state) => state.order)

  const [rows, setRows] = useState(null)
  const [status, setStatus] = useState('')
  const [alert, setAlert] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.set('orderStatus', status)
    dispatch(processOrder(order.order_id, formData))
  }

  useEffect(() => {
    if ((order && Number(orderID) !== order.order_id) || isUpdated) {
      dispatch(getOrderDetails(orderID))
    }
    if (error) {
      setAlert({ type: 'danger', message: error })
      dispatch(clearErrors())
    }
    if (updateError) {
      setAlert({ type: 'danger', message: updateError })
      dispatch(clearErrors())
    }
    if (isUpdated) {
      setAlert({ type: 'success', message: 'Order Updated successfully' })
      dispatch({ type: UPDATE_ORDER_RESET })
    }
  }, [order, isUpdated, dispatch, error, updateError, orderID])

  useEffect(() => {
    if (order) {
      setStatus(order?.order_status)
      setRows(
        order?.order_items?.map((item) => ({
          productID: item.product_id,
          name: item.product.name,
          price: item.discounted_total ? (
            <>
              {' '}
              <strike>{item.product.price}</strike>
              <br />
              <span>{item.discounted_total / item.quantity}</span>{' '}
            </>
          ) : (
            item.product.price
          ),
          image: (
            <img
              src={item.product.product_images[0].image_url}
              alt=""
              width="100"
              height="100"
              style={{ objectFit: 'contain' }}
            ></img>
          ),
          quantity: item.quantity,
        })),
      )
    }
  }, [loading, order, history, dispatch])

  const columns = [
    {
      label: 'Image',
      field: 'image',
      width: 150,
      sort: 'disabled',
    },
    {
      label: 'Product ID',
      field: 'productID',
      width: 220,
    },
    {
      label: 'Product',
      field: 'name',
      width: 250,
    },
    {
      label: 'Unit Price (Rs.)',
      field: 'price',
      width: 150,
    },
    {
      label: 'Quantity',
      field: 'quantity',
      width: 150,
    },
  ]

  return (
    <>
      {!loading && <Metadata title={`Order ${order.order_id}`} />}
      {alert && <CAlert color={alert.type}>{alert.message}</CAlert>}
      <CCard className="mb-4">
        <CCardHeader>{!loading && `Order ${order.order_id}`}</CCardHeader>
        {!loading ? (
          <CCardBody>
            <CRow>
              <CForm onSubmit={handleSubmit}>
                <CRow className="mb-4 justify-content-center align-items-end">
                  <CCol xs="8">
                    <CFormLabel htmlFor="category">Status</CFormLabel>
                    <CFormSelect
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      id="category"
                    >
                      <option disabled={true} value={PROCESSING}>
                        Processing
                      </option>
                      <option disabled={status !== PROCESSING} value={IN_TRANSIT}>
                        In Transit
                      </option>
                      <option disabled={status !== IN_TRANSIT} value={DELIVERED}>
                        Delivered
                      </option>
                    </CFormSelect>
                  </CCol>
                  <CCol xs="4">
                    <CButton disabled={loadingOrder || loading} type="submit">
                      {!loading && !loadingOrder ? (
                        'Save'
                      ) : (
                        <>
                          <CSpinner component="span" size="sm" aria-hidden="true" />
                          Updating Status...
                        </>
                      )}
                    </CButton>
                  </CCol>
                </CRow>
              </CForm>
            </CRow>
            <CRow>
              <CCol sm="12" lg="6">
                <CCard textColor="dark" className="mb-3 border-top-info border-top-3">
                  <CCardHeader>Order Info</CCardHeader>
                  <CCardBody>
                    <CCardText>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Order Status</strong>
                          </p>
                          <CBadge
                            color={
                              order.order_status === PROCESSING
                                ? 'info'
                                : order.order_status === IN_TRANSIT
                                ? 'warning'
                                : order.order_status === DELIVERED && 'success'
                            }
                          >
                            <h5>{order.order_status?.toUpperCase()}</h5>
                          </CBadge>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Payment Status</strong>
                          </p>
                          <CBadge color={order.payment_status === 'PAID' ? 'success' : 'danger'}>
                            {order.payment_status === 'PAID' ? <h5>PAID</h5> : <h5>NOT PAID</h5>}
                          </CBadge>
                        </CListGroupItem>
                      </CListGroup>
                      {order.payment_id && (
                        <CListGroup>
                          <CListGroupItem className="d-flex justify-content-between align-items-center">
                            <p>
                              <strong>Stripe ID</strong>
                            </p>
                            <p>{order.payment_id}</p>
                          </CListGroupItem>
                        </CListGroup>
                      )}
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Payment Method</strong>
                          </p>
                          <p>{order.payment_method}</p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        {order.delivered_on ? (
                          <CListGroupItem className="d-flex justify-content-between align-items-center">
                            <p>
                              <strong>Delivery Confirmed On</strong>
                            </p>
                            <CBadge color="success">
                              <h5>{order.delivered_on?.toString().slice(0, 10)}</h5>
                            </CBadge>
                          </CListGroupItem>
                        ) : (
                          <CListGroupItem className="d-flex justify-content-between align-items-center">
                            <p>
                              <strong>Placed On</strong>
                            </p>
                            <p>{order.placed_on?.toString().slice(0, 10)}</p>
                          </CListGroupItem>
                        )}
                      </CListGroup>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol sm="12" lg="6">
                <CCard textColor="dark" className="mb-3 border-top-success border-top-3">
                  <CCardHeader>Payment Info</CCardHeader>
                  <CCardBody>
                    <CCardText>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Base Price</strong>
                          </p>
                          <p>{`Rs.${order.items_price?.toFixed(2)}`}</p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Tax</strong>
                          </p>
                          <p>{`Rs.${order.tax_price?.toFixed(2)}`}</p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Shipping Charges</strong>
                          </p>
                          <p>{`Rs.${order.shipping_price?.toFixed(2)}`}</p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Total Price</strong>
                          </p>
                          <h3>{`Rs.${order.total_price?.toFixed(2)}`}</h3>
                        </CListGroupItem>
                      </CListGroup>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="12" lg="6">
                <CCard textColor="dark" className="mb-3 border-top-primary border-top-3">
                  <CCardHeader>Shipping Info</CCardHeader>
                  <CCardBody>
                    <CCardText>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Address</strong>
                          </p>
                          <p>
                            {`${order.address}, ${order.city}, ${order.province}, ${order.country}`}
                          </p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Postal Code</strong>
                          </p>
                          <p>{order.postal_code}</p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>Phone</strong>
                          </p>
                          <p>{order.phone_number}</p>
                        </CListGroupItem>
                      </CListGroup>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
              <CCol sm="12" lg="6">
                <CCard textColor="dark" className="mb-3 border-top-danger border-top-3">
                  <CCardHeader>User Info</CCardHeader>
                  <CCardBody>
                    <CCardText>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>User ID</strong>
                          </p>
                          <p>{order.user_id}</p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>User Name</strong>
                          </p>
                          <p>{order.user?.full_name}</p>
                        </CListGroupItem>
                      </CListGroup>
                      <CListGroup>
                        <CListGroupItem className="d-flex justify-content-between align-items-center">
                          <p>
                            <strong>User Email</strong>
                          </p>
                          <p>{order.user?.email}</p>
                        </CListGroupItem>
                      </CListGroup>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="12">
                <CCard textColor="dark" className={`mb-3 border-top-warning border-top-3`}>
                  <CCardHeader>Order Items</CCardHeader>
                  <CCardBody>
                    <Table rows={rows} columns={columns} scrollY nohover noSearch />
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        ) : (
          <center>
            <CSpinner color="primary" size="xl" />
          </center>
        )}
      </CCard>
    </>
  )
}

export default ProcessOrder
