import gql from 'graphql-tag'

export const CREATE_BRAND = gql`
  mutation($brand: BrandInput!) {
    addBrand(brand: $brand) {
      name
    }
  }
`

export const RETRIEVE_BRAND = gql`
  query fetchBrand($id: String!) {
    brand(id: $id) {
      name
    }
  }
`
