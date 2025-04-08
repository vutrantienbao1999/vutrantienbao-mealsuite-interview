import React, { forwardRef, useImperativeHandle, useState } from 'react'
import Dialog from '@mui/material/Dialog';
import CancelButton from '../../components/CancelButton/CancelButton';
import ApproveButton from '../../components/ApproveButton/ApproveButton';
import { apiRequest } from '../../services/apiServices';
import { useManagmentContext } from '../../context/ManagmentContext';

const AddPopup = forwardRef((props, ref: React.Ref<{ open: () => void; close: () => void }>) => {
  const { setTickets } = useManagmentContext();

  const [description, setDescription] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      open: () => setOpenDialog(true),
      close: () => setOpenDialog(false),
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiRequest('/tickets', 'POST', { description });
    setOpenDialog(false);
    const newTickets = await apiRequest('/tickets');
    setTickets(newTickets);
  };

  return (
    <Dialog open={openDialog} fullWidth maxWidth="md" PaperProps={{
      sx: {
        height: '40%', // Set height to fill the screen
      },
    }}>
      <div className='flex flex-col justify-items-center h-full'>
        <div className="flex flex-col justify-items-start content-center p-6 bg-white rounded-lg shadow-md h-full">
          <h1 className="text-xl font-bold mb-6">Create Issue</h1>
          <form onSubmit={handleSubmit}>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Description</label>
              <textarea
                className="w-full border-gray-300 border rounded-md py-2 px-3"
                rows={4}
                placeholder="Describe the issue"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end">
              <CancelButton handleOnClick={() => setOpenDialog(false)} />
              <ApproveButton>Create</ApproveButton>
            </div>
          </form>
        </div>
      </div>


    </Dialog> // Replace with your state management for opening/closing the dialog

  );
});

export default AddPopup