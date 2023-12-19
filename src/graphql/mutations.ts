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