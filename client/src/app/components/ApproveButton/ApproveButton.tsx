

import { ReactNode } from 'react';

function ApproveButton({ children, ...props }: { children: ReactNode; [key: string]: any }) {

  return (
    <button
      type="submit"
      className="ml-3 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
      {...props}
    >
      {children}
    </button>
  );
}

export default ApproveButton;
