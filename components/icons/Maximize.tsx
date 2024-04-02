import * as React from "react";
import { SVGProps } from "react";

const Maximize = (props: SVGProps<any>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 9V3h-6M3 15v6h6M21 3l-7.5 7.5M10.5 13.5 3 21"
      {...props}
    />
  </svg>
);
export default Maximize;
