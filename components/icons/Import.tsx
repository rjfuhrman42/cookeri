import * as React from "react";
import { SVGProps } from "react";

const Import = (props: SVGProps<any>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m9.32 11.68 2.56 2.56 2.56-2.56M11.88 4v10.17"
      {...props}
    />
    <path
      stroke="#292D32"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M20 12.18c0 4.42-3 8-8 8s-8-3.58-8-8"
      {...props}
    />
  </svg>
);

export default Import;
