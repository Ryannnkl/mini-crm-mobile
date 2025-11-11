import { gql } from "@apollo/client";

export const GET_COMPANIES = gql`
  query GetCompanies {
    companies {
      id
      name
      status
      website
      phone
      primaryContactName
      primaryContactEmail
      potentialValue
      leadSource
      userId
    }
  }
`;

export const GET_COMPANY = gql`
  query GetCompany($id: Int!) {
    company(id: $id) {
      id
      name
      status
      website
      phone
      primaryContactName
      primaryContactEmail
      potentialValue
      leadSource
      userId
    }
  }
`;

export const CREATE_COMPANY = gql`
  mutation CreateCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      id
      name
      status
      website
      phone
      primaryContactName
      primaryContactEmail
      potentialValue
      leadSource
      userId
    }
  }
`;

export const UPDATE_COMPANY = gql`
  mutation UpdateCompany($id: Int!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input) {
      id
      name
      status
      website
      phone
      primaryContactName
      primaryContactEmail
      potentialValue
      leadSource
      userId
    }
  }
`;

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: Int!) {
    deleteCompany(id: $id)
  }
`;