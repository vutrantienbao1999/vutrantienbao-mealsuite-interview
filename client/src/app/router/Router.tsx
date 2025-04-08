import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Tickets from '../views/tickets/tickets';
import styles from '../app.module.css';
import TicketDetails from '../views/ticket-details/ticket-details';
import { useCallback, useEffect, useLayoutEffect } from 'react';
import { useManagmentContext } from '../context/ManagmentContext';
import { apiRequest } from '../services/apiServices';

export default function AppRouter(): JSX.Element {
  const { handleFetchData } = useManagmentContext()

  useEffect(() => {
    handleFetchData()
  }, [handleFetchData])

  return (
    <div className={styles['app']}>
      <Routes>
        <Route path="/" element={<Tickets />} />
        {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
        <Route path="/ticket/:id" element={<TicketDetails />} />
      </Routes>
    </div>
  )
}
