import { gql } from "@apollo/client"

export const LOGIN_USER = gql`mutation LoginUser($email: String!, $password: String!) {
  loginUser(email: $email, password: $password) {
    id
    firstName
    lastName
    email
    phone
  }
}`

export const REGISTER_USER = gql`mutation RegisterUser($user: RegisterUserInput!) {
  registerUser(user: $user) {
    id
    firstName
    lastName
    email
    phone
  }
}`

export const ADD_PRODUCT = gql`
mutation AddProduct($product: AddProductInput!) {
  addProduct(product: $product) {
    id
    title
    categories
    description
    price
    rentPrice
    rentOption
    createdAt
  }
}
`

export const EDIT_PRODUCT = gql`mutation EditProduct($productId: ID!, $product: EditProductInput!) {
    editProduct(productId: $productId, product: $product) {
      id
      title
      categories
      description
      price
      rentPrice
      rentOption
    }
  }`

export const DELETE_PRODUCT = gql`mutation DeleteProduct($productId: ID!) {
    deleteProduct(productId: $productId) {
      id
    }
  }`