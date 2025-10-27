import React from "react";
import { popularDishes } from "../../Constants";

const PopularDishes = () => {
  return (
    <div className="mt-2 pr-2">
      <div className="bg-1a1a1a w-full rounded-lg border border-gray-700">
        <div className="flex justify-between items-center px-2 py-1">
          <h1 className="text-f5f5f5 text-sm font-semibold tracking-wide">
            Popular Dishes
          </h1>
          <a href="" className="text-blue-400 text-xs font-semibold">
            View all
          </a>
        </div>

        <div className="overflow-y-scroll h-200px scrollbar-hide">
          {popularDishes.map((dish) => {
            return (
              <div
                key={dish.id}
                className="flex items-center gap-1 bg-1f1f1f rounded-8px px-2 py-1 mt-1 mx-2"
              >
                <h1 className="text-f5f5f5 font-bold text-sm mr-1">{dish.id < 10 ? `0${dish.id}` : dish.id}</h1>
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-25px h-25px rounded-full"
                />
                <div>
                  <h1 className="text-f5f5f5 font-semibold tracking-wide text-xs">{dish.name}</h1>
                  <p className="text-f5f5f5 text-xs font-semibold mt-0.5">
                    <span className="text-ababab">Orders: </span>
                    {dish.numberOfOrders}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;