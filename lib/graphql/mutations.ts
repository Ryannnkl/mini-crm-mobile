import { gql } from "@apollo/client";

export const CREATE_INTERACTION = gql`
  mutation CreateInteraction($companyId: Int!, $content: String!) {
    createInteraction(companyId: $companyId, content: $content) {
      id
      content
      companyId
      createdAt
    }
  }
`;

export const UPDATE_INTERACTION = gql`
  mutation UpdateInteraction($id: Int!, $input: UpdateInteractionInput!) {
    updateInteraction(id: $id, input: $input) {
      id
      type
      content
      interactionDate
      companyId
      userId
      updatedAt
    }
  }
`;

export const DELETE_INTERACTION = gql`
  mutation DeleteInteraction($id: Int!) {
    deleteInteraction(id: $id)
  }
`;

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
