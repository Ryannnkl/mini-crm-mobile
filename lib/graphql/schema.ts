export const typeDefs = `#graphql
  type Interaction {
    id: Int!
    type: String!
    content: String!
    interactionDate: String!
    companyId: Int!
    userId: String!
    createdAt: String!
    updatedAt: String!
  }

  type Company {
    id: Int!
    name: String!
    status: CompanyStatus!
    website: String
    phone: String
    primaryContactName: String
    primaryContactEmail: String
    potentialValue: Int!
    leadSource: LeadSource!
    userId: String!
    interactions: [Interaction!]!
  }

  enum CompanyStatus {
    lead
    negotiating
    won
    lost
  }

  enum LeadSource {
    website
    referral
    cold_call
    other
  }

  type Query {
    companies: [Company!]!
    company(id: Int!): Company
    interactions(companyId: Int!): [Interaction!]!
  }

  input CreateInteractionInput {
    type: String!
    content: String!
    interactionDate: String!
    companyId: Int!
  }

  input UpdateInteractionInput {
    type: String
    content: String
    interactionDate: String
  }

  type Mutation {
    createCompany(input: CreateCompanyInput!): Company!
    updateCompany(id: Int!, input: UpdateCompanyInput!): Company!
    deleteCompany(id: Int!): Boolean!
    createInteraction(input: CreateInteractionInput!): Interaction!
    updateInteraction(id: Int!, input: UpdateInteractionInput!): Interaction!
    deleteInteraction(id: Int!): Boolean!
  }

  input CreateCompanyInput {
    name: String!
    status: CompanyStatus
    website: String
    phone: String
    primaryContactName: String
    primaryContactEmail: String
    potentialValue: Int
    leadSource: LeadSource
  }

  input UpdateCompanyInput {
    name: String
    status: CompanyStatus
    website: String
    phone: String
    primaryContactName: String
    primaryContactEmail: String
    potentialValue: Int
    leadSource: LeadSource
  }
`;