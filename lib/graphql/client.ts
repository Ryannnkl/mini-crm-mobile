import { ApolloClient, InMemoryCache } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { HttpLink } from "@apollo/client/link/http";
import { authClient } from "../auth-client";

const httpLink = new HttpLink({
  uri: `${process.env.EXPO_PUBLIC_GRAPHQL_BASE_URL}/api/graphql`,
});

const authLink = new SetContextLink(async (prevContext, operation) => {
  const session = await authClient.getSession()
  const token = session?.data?.session.token;

  return {
    headers: {
      ...prevContext.headers,
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
      ...(token ? { cookie: `better-auth.session_token=${token}` } : {}),
    },
  };
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});