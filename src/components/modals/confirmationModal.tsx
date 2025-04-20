import React from 'react';
import { Modal } from 'react-responsive-modal';
import 'react-responsive-modal/styles.css';
import {ConfirmationModalProps} from './types'


const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal open={open} onClose={onClose} center>
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Confirm Slot Booking</h2>
        <p className="text-lg mb-6">Are you sure you want to book this slot?</p>
        <div className="flex justify-between">
          <button
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => { onConfirm(); onClose(); }}
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
