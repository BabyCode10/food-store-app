import React from "react";

const Message = ({ children, type }) => {
  switch (type) {
    case "success":
      type = "bg-green-500";
      break;
    case "alert":
      type = "bg-yellow-500";
      break;
    case "error":
      type = "bg-red-500";
      break;
    default:
      type = "bg-teal-500";
      break;
  }

  return (
    <div className={`${type} py-2`}>
      <p className="text-sm text-center text-white font-medium">{children}</p>
    </div>
  );
};

export default Message;
