import React from "react";
import { animated, useTransition } from "react-spring";

const Message = ({ children, show, type }) => {
  let transitionsMessage = useTransition(show, null, {
    config: { mass: 1, tension: 500, friction: 50 },
    from: { transform: "translateY(-2.5rem)" },
    enter: { transform: "translateY(0px)" },
    leave: { transform: "translateY(-2.5rem)" },
  });

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

  return transitionsMessage.map(
    ({ item, key, props: style }) =>
      item && (
        <animated.div
          key={key}
          style={style}
          className={`absolute top-0 inset-x-0 ${type} py-2`}
        >
          <p className="text-sm text-center text-white font-medium">
            {children}
          </p>
        </animated.div>
      )
  );
};

export default Message;
