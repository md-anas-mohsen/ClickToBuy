import React from 'react'

// examples

const AllProducts = React.lazy(() => import('./views/pages/products/AllProducts'))
const AddProduct = React.lazy(() => import('./views/pages/products/AddProduct'))
const UpdateProduct = React.lazy(() => import('./views/pages/products/UpdateProduct'))
const AllOrders = React.lazy(() => import('./views/pages/orders/AllOrders'))
const ProcessOrder = React.lazy(() => import('./views/pages/orders/ProcessOrder'))
const AllUsers = React.lazy(() => import('./views/pages/users/AllUsers'))
const UpdateUser = React.lazy(() => import('./views/pages/users/UpdateUser'))
const ProductReviews = React.lazy(() => import('./views/pages/products/ProductReviews'))
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const AllSlides = React.lazy(() => import('./views/pages/banner/AllSlides'))
const AddSlide = React.lazy(() => import('./views/pages/banner/AddSlide'))
const EditSlide = React.lazy(() => import('./views/pages/banner/EditSlide'))
const AllCategories = React.lazy(() => import('./views/pages/categories/AllCategories'))
const EditCategory = React.lazy(() => import('./views/pages/categories/EditCategory'))

const routes = [
  { path: '/', exact: true, name: 'Admin' },
  { path: '/admin/dashboard', name: 'Dashboard', component: Dashboard, exact: true },
  { path: '/admin/products', name: 'Products', exact: true },
  {
    path: '/admin/products/update/:id',
    name: 'Update Product',
    component: UpdateProduct,
    exact: true,
  },
  {
    path: '/admin/products/all-products',
    name: 'All Products',
    component: AllProducts,
    exact: true,
  },
  { path: '/admin/products/add-product', name: 'Add Product', component: AddProduct, exact: true },
  {
    path: '/admin/products/product-reviews',
    name: 'Product Reviews',
    component: AllProducts,
    exact: true,
  },
  {
    path: '/admin/products/product-reviews/:id',
    name: 'Product Reviews',
    component: ProductReviews,
  },
  {
    path: '/admin/categories/all-categories',
    name: 'All Categories',
    component: AllCategories,
    exact: true,
  },
  { path: '/admin/categories/:id', name: 'Edit Category', component: EditCategory },
  { path: '/admin/products/:id', name: 'Update Product', component: UpdateProduct },
  { path: '/admin/orders', name: 'All Orders', component: AllOrders, exact: true },
  { path: '/admin/orders/:id', name: 'Process Order', component: ProcessOrder },
  { path: '/admin/users', name: 'All Users', component: AllUsers, exact: true },
  { path: '/admin/users/:id', name: 'Update User', component: UpdateUser },
  { path: '/admin/banner/allslides', name: 'All Slides', component: AllSlides },
  { path: '/admin/banner/addslide', name: 'Add Slide', component: AddSlide },
  { path: '/admin/banner/slide/:id', name: 'Edit Slide', component: EditSlide },
]

export default routes
