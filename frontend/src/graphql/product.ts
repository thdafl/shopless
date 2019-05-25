import gql from 'graphql-tag'

export const ADD_PRODUCT = gql`
  mutation($product: ProductInput!) {
    addProduct(product: $product) {
      name
      brand {
        name
      }
    }
  }
`
