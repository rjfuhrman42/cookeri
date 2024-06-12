import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    {...props}
  >
    <path
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 22h6c5 0 7-2 7-7V9c0-5-2-7-7-7H9C4 2 2 4 2 9v6c0 5 2 7 7 7Z"
    />
    <path
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M18.38 15.27V7.58c0-.77-.62-1.33-1.38-1.27h-.04c-1.34.11-3.37.8-4.51 1.51l-.11.07c-.18.11-.49.11-.68 0l-.16-.1C10.37 7.08 8.34 6.41 7 6.3c-.76-.06-1.38.51-1.38 1.27v7.7c0 .61.5 1.19 1.11 1.26l.18.03c1.38.18 3.52.89 4.74 1.56l.03.01c.17.1.45.1.61 0 1.22-.68 3.37-1.38 4.76-1.57l.21-.03c.62-.07 1.12-.64 1.12-1.26ZM12 8.1v9.56"
    />
  </svg>
);
export default SvgComponent;
