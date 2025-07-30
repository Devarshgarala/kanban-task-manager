// src/graphql/client.ts
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';

// HTTP Link
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

// Auth Link (if you need authentication)
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  // Note: localStorage is not available in Claude.ai artifacts
  // In a real app, you would use: const token = localStorage.getItem('authToken');
  const token = null; // Replace with actual token logic in your app
  
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Apollo Client configuration
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          tasks: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
      Task: {
        fields: {
          // Cache individual tasks by their ID
          id: {
            read(id) {
              return id;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-and-network',
    },
    query: {
      errorPolicy: 'all',
      fetchPolicy: 'cache-first',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  // Enable dev tools in development
  connectToDevTools: true,
});

// Error handling - these functions must return promises
client.onResetStore(async () => {
  console.log('Apollo store reset');
  // Add any cleanup logic here if needed
  // Return a resolved promise (async function automatically returns Promise<void>)
});

// Network error handling
client.onClearStore(async () => {
  console.log('Apollo store cleared');
  // Add any cleanup logic here if needed
  // Return a resolved promise (async function automatically returns Promise<void>)
});

export default client;