import { createClient, fetchExchange } from "urql";

const client = createClient({
  url: process.env.API_URL || "http://localhost:3000/graphql",
  fetchOptions: () => {
    // Token?
    return {
      headers: {},
    };
  },
  exchanges: [fetchExchange],
});

export default client;
