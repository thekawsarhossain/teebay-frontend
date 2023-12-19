import { gql } from "@apollo/client";

export const GET_USER = gql`query GetUser($userId: ID!) {
  getUser(id: $userId) {
    id
    firstName
    lastName
    email
    phone
    address
    products {
      id
      title
    }
    transactions {
      id
    }
    rentals {
      id
    }
  }
}`

export const GET_ALL_PRODUCTS = gql`query GetAllProducts {
    getAllProducts {
      id
      title
      categories
      description
      price
      rentPrice
      rentOption
      owner {
        id
        firstName
      }
      createdAt
    }
  }
  `
