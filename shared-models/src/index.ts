export type User = {
  id: number;
  name: string;
};

export type TicketStatus = 'assigned' | 'completed' | 'open';

export type Ticket = {
  id: number;
  description: string;
  assigneeId: null | number;
  completed: boolean;
};

// export type TicketWithAssignee = Ticket & {
//   assignee?: User["name"] | '';
//   status: TicketStatus;
// };
