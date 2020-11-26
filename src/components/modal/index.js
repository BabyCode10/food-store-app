import React from "react";
import { animated } from "react-spring";

const Modal = ({ children, style, show, onShow }) => {
  return (
    <animated.div
      style={style}
      className="fixed inset-0 flex items-center justify-center"
    >
      <div
        className="absolute h-full w-full bg-indigo-800 bg-opacity-25"
        onClick={onShow}
      />

      <div className="absolute w-full max-w-xl bg-white shadow-lg rounded-lg p-6">
        {children}
      </div>
    </animated.div>
  );
};

export default Modal;
