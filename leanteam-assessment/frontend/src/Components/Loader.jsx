import React from "react";

export const Loader = () => {
    return /*#__PURE__*/ React.createElement(
        "div",
        {
            className: "flex justify-center items-center w-full h-full",
        },
        /*#__PURE__*/ React.createElement("div", {
            className:
                "animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900",
        })
    );
};
