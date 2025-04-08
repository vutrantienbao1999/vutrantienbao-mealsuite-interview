import { Ticket } from '@acme/shared-models'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { TICKET_STATUS } from '../../constant'
import { useManagmentContext } from '../../context/ManagmentContext'

function TicketItem({ ticket }: { ticket: Ticket }) {
  const { users } = useManagmentContext();

  const assignee = users.find(user => user.id === ticket.assigneeId)?.name || 'Unassigned';
  const ticketStatus = ticket.completed ? TICKET_STATUS.COMPLETED : TICKET_STATUS.OPEN;

  return (
    <NavLink to={`/ticket/${ticket.id}`}>
      <div className="bg-white p-4 rounded shadow-md flex gap-4 justify-between border border-gray-300 hover:shadow-lg">
        {/* Top Section */}
        <div className='flex flex-col justify-between items-center gap-2'>
          <div>
            <p className="text-gray-800 font-semibold text-sm">Ticket ID: {ticket.id}</p>
          </div>
          <div className="bg-gray-200 w-full h-6 rounded flex items-center justify-center">
            <span className="text-gray-600 text-xs font-medium">{assignee}</span>
          </div>

        </div>
        {/* Bottom Section */}
        <div className="space-x-1">
          {/* Gray 1h Icon */}
          <p className="text-blue-600 font-medium text-sm">{ticketStatus}</p>
        </div>
      </div>
    </NavLink>
  )
}

export default TicketItem