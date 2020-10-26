import React from "react";

const Modal = ({ children, show, onShow }) => {
  return (
    show && (
      <div className="fixed inset-0 flex items-center justify-center">
        <div
          className="absolute h-full w-full bg-indigo-800 bg-opacity-25"
          onClick={onShow}
        />

        <div className="absolute w-full max-w-xl bg-white shadow-lg rounded-lg p-6">
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
