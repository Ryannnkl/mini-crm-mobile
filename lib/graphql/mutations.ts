import { gql } from "@apollo/client";

export const DELETE_COMPANY = gql`
  mutation DeleteCompany($id: Int!) {
    deleteCompany(id: $id)
  }
`;

export const UPDATE_COMPANY_STATUS = gql`
  mutation UpdateCompany($id: Int!, $input: UpdateCompanyInput!) {
    updateCompany(id: $id, input: $input) {
      id
      status
    }
  }
`;
