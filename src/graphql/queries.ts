import { gql } from "@apollo/client";

export const GET_USER = gql`query GetUser($userId: ID!) {
  getUser(id: $userId) {
    id
    firstName
    lastName
    email
  }
}`

export const GET_PRODUCT = gql`query GetProduct($id: ID!) {
    getProduct(id: $id) {
        id
        title
        description
        categories
        price
        rentPrice
        rentOption
        createdAt
        owner {
            id
        }
    }
  }`

export const GET_USER_PRODUCTS = gql`query GetUserProducts($userId: ID!) {
    getUserProducts(userId: $userId) {
        id
        title
        description
        categories
        price
        rentPrice
        rentOption
        createdAt
        owner {
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
