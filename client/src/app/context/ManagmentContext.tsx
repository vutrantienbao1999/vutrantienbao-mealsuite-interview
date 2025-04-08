import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useReducer, useState } from "react";

import { TicketStatus, User, Ticket } from '@acme/shared-models';
import { TICKET_STATUS } from "../constant";
import { apiRequest } from "../services/apiServices";


const ManagmentContext = createContext<{
  tickets: Ticket[];
  users: User[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  handleFetchData: () => Promise<void>;
}>({
  tickets: [] as Ticket[],
  users: [] as User[],
  setTickets: () => { },
  setUsers: () => { },
  handleFetchData: async () => { },
});


function ManagmentProvider({ children }: React.PropsWithChildren<{}>) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState([] as User[]);

  const handleFetchData = useCallback(async () => {
    try {
      const [ticketsResponse, usersResponse] = await Promise.all([
        apiRequest('/tickets'),
        apiRequest('/users'),
      ]);
      setTickets(ticketsResponse);
      setUsers(usersResponse);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  // Very basic way to synchronize state with server.
  // Feel free to use any state/fetch library you want (e.g. react-query, xstate, redux, etc.).

  return (
    <ManagmentContext.Provider value={{ tickets, users, setTickets, setUsers, handleFetchData }}>
      {children}
    </ManagmentContext.Provider>
  );
}

function useManagmentContext() {
  const context = useContext(ManagmentContext);
  if (!context) {
    throw new Error("useCities must be used within a CitiesProvider");
  }
  return context;
}

export { ManagmentProvider, useManagmentContext, ManagmentContext };
