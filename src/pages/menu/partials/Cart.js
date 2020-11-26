import React from "react";
import { useSelector } from "react-redux";
import { useTransition, animated } from "react-spring";
import { Trash } from "react-feather";
import NumberFormat from "react-number-format";

const Cart = ({ deleteCartHandler }) => {
  const cart = useSelector((state) => state.cart);
  const transitionCarts = useTransition(cart.menus, (menu) => menu.id, {
    config: { mass: 1, tension: 500, friction: 50 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const animationCarts = transitionCarts.map(({ item, props, key }) => (
    <animated.li
      key={key}
      style={props}
      className="flex items-center justify-between py-2"
    >
      <div className="w-2/5 flex items-center">
        <div className="min-w-10 h-10 w-10 flex items-center justify-center overflow-hidden bg-gray-400 rounded-lg mr-2">
          {item.url && (
            <img
              className="object-cover w-full text-gray-800 text-xs text-center font-medium truncate"
              src={item.url}
              alt={item.name}
            />
          )}
        </div>

        <p className="text-sm text-gray-800 font-semibold truncate">
          {item.name}
        </p>
      </div>

      <div className="w-1/5 text-sm text-gray-600 text-center font-semibold">
        {item.quantity}x
      </div>

      <div className="w-2/5 flex items-center justify-end text-sm text-gray-600 text-right font-semibold">
        <NumberFormat
          value={item.price}
          displayType={"text"}
          thousandSeparator={true}
          prefix={"Rp "}
          renderText={(value) => <span className="truncate">{value}</span>}
        />

        <button
          className="focus:outline-none ml-4"
          onClick={() => deleteCartHandler(item)}
        >
          <Trash className="text-red-400" height={16} />
        </button>
      </div>
    </animated.li>
  ));

  return (
    <ul className="flex-1 flex flex-col overflow-y-auto">{animationCarts}</ul>
  );
};

export default Cart;
