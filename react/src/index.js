import ReactDOM from 'react-dom';
import App from './App';
import { QueryClientProvider, QueryClient } from "react-query";
import { StoreProvider } from "./store";

const defaultQueryFn = async ({ queryKey }) => {
  const response = await fetch(`http://localhost:5050/api/v1${queryKey[0]}`);
  return response.json();
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: defaultQueryFn,
    },
  },
});


ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <StoreProvider>
      <App />
    </StoreProvider>
  </QueryClientProvider>,
  document.getElementById('root')
);
