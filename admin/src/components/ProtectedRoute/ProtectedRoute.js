/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ADMIN_ROLE } from 'src/constants/userConstants'

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth)

  return (
    <>
      {!loading && (
        <Route
          {...rest}
          render={(props) => {
            if (!isAuthenticated || user.role !== ADMIN_ROLE) {
              return <Redirect to="/admin/signin" />
            }
            return <Component {...props} />
          }}
        />
      )}
    </>
  )
}

export default ProtectedRoute
