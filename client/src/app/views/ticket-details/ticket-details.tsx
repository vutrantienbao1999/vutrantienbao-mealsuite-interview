import { useCallback, useEffect, useState } from 'react';

import { useManagmentContext } from '../../context/ManagmentContext';
import { useNavigate, useParams } from 'react-router-dom';
import { TICKET_STATUS } from '../../constant';
import { Ticket } from '@acme/shared-models';
import CancelButton from '../../components/CancelButton/CancelButton';
import ApproveButton from '../../components/ApproveButton/ApproveButton';
import { apiRequest } from '../../services/apiServices';


function TicketDetails() {
  const { id } = useParams();
  const idNumber = Number(id);
  const navigate = useNavigate();
  const { tickets, users, handleFetchData } = useManagmentContext();
  const unassignedOption = {
    id: 0,
    name: 'Unassigned',
  }

  const [userIdCurrent, setIdCurrent] = useState<number>(unassignedOption.id);
  const [statusCurrent, setStatusCurrent] = useState<string>('');
  const [descriptionCurrent, setDescriptionCurrent] = useState<string>('');

  const ticketFound: Ticket | undefined = tickets.find((ticket) => ticket.id === idNumber);
  const ticketAssigneeId = ticketFound?.assigneeId


  const handleFoundCurrentTicket = useCallback(() => {
    if (ticketFound) {
      setDescriptionCurrent(ticketFound.description);
      setIdCurrent(ticketFound?.assigneeId ?? unassignedOption.id);
      setStatusCurrent(ticketFound.completed ? TICKET_STATUS.COMPLETED : TICKET_STATUS.OPEN);
    }
  }, [tickets])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the page reload

    let isUpdated = false;
    //unassign
    if (ticketAssigneeId && userIdCurrent === unassignedOption.id) {
      //PUT /tickets/:ticketId/unassign
      await apiRequest(`/tickets/${ticketFound?.id}/unassign`, 'PUT');
      isUpdated = true;
    }

    //assign to another user
    console.log(userIdCurrent);
    console.log(ticketAssigneeId);
    if (userIdCurrent !== ticketAssigneeId && userIdCurrent !== unassignedOption.id) {
      //PUT /tickets/:ticketId/assign/:userId
      await apiRequest(`/tickets/${ticketFound?.id}/assign/${userIdCurrent}`, 'PUT');
      isUpdated = true;
    }

    switch (statusCurrent) {
      case TICKET_STATUS.COMPLETED: {
        if (ticketFound?.completed) {
          break;
        }

        //PUT /tickets/:id/complete
        await apiRequest(`/tickets/${ticketFound?.id}/complete`, 'PUT');
        isUpdated = true;
        break;
      }
      case TICKET_STATUS.OPEN: {
        if (!ticketFound?.completed) {
          break;
        }

        //DELETE /tickets/:id/complete
        await apiRequest(`/tickets/${ticketFound?.id}/complete`, 'DELETE');
        isUpdated = true;
        break;
      }
      default:
        break;
    }

    if (isUpdated) {
      await handleFetchData();
      navigate('/');
      return;
    }
  }

  useEffect(() => {
    handleFoundCurrentTicket();
  }, [handleFoundCurrentTicket])


  return (
    <div className='flex items-center justify-center min-h-screen max-w-4xl mx-auto p-4'>
      <div className="flex flex-col justify-items-start content-center p-6 bg-white rounded-lg shadow-md w-2/3">
        <h1 className="text-xl font-bold mb-6">Ticket ID: {ticketFound?.id}</h1>
        <form onSubmit={handleSubmit}>
          {/* Assignee */}
          <div className="mb-4">
            <label htmlFor="assignee" className="block text-gray-700 font-medium">Assignee</label>
            <select
              className="w-full border-gray-300 border rounded-md py-2 px-3"
              value={userIdCurrent}
              id="assignee"
              onChange={(e) => setIdCurrent(Number(e.target.value))}
            >
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
              <option value={unassignedOption.id}>
                {unassignedOption.name}
              </option>

            </select>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Description</label>
            <textarea
              className="w-full border-gray-300 border rounded-md py-2 px-3"
              rows={4}
              placeholder="Describe the issue"
              value={descriptionCurrent}
              disabled
            />
          </div>

          {/* Status */}
          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 font-medium">Status</label>
            <select
              id="status"
              className="w-full border-gray-300 border rounded-md py-2 px-3"
              value={statusCurrent}
              onChange={(e) => setStatusCurrent(e.target.value)}
            >
              <option>
                {TICKET_STATUS.OPEN}
              </option>
              <option>
                {TICKET_STATUS.COMPLETED}
              </option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <CancelButton handleOnClick={() => {
              navigate('/');
            }} />
            <ApproveButton>Update</ApproveButton>
          </div>
        </form>
      </div>
    </div>
  );
};


export default TicketDetails;


