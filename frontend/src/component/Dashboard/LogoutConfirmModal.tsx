// src/component/Dashboard/LogoutConfirmModal.tsx
import React from 'react';

interface Props {
  show: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmModal: React.FC<Props> = ({ show, onClose, onConfirm }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>ยืนยันการออกจากระบบ</h3>
        <p>คุณต้องการออกจากระบบใช่หรือไม่?</p>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            ยกเลิก |
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            | ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;