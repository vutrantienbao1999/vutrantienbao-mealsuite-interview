import { ManagmentProvider } from './context/ManagmentContext';
import AppRouter from './router/Router';

const App = () => {
  return (
    <ManagmentProvider>
      <AppRouter />
    </ManagmentProvider>
  );
};

export default App;
