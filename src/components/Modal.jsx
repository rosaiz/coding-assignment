import ReactModal from 'react-modal';

// Make sure to set the app element for accessibility
ReactModal.setAppElement('#root');

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
  };
  

const Modal = ({ isOpen, onClose, children }) => (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Modal"
    >
      <button onClick={onClose}>Close</button>
      {children}
    </ReactModal>
  );
  
  export default Modal;
