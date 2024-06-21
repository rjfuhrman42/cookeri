import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="#4285F4"
      d="M18.094 18.75c2.11-1.969 3.047-5.25 2.484-8.39h-8.39v3.468h4.78c-.187 1.125-.843 2.063-1.78 2.672l2.906 2.25Z"
    />
    <path
      fill="#34A853"
      d="M4.219 15.984a9 9 0 0 0 13.875 2.766l-2.907-2.25c-2.484 1.64-6.609 1.031-8.015-2.813l-2.953 2.297Z"
    />
    <path
      fill="#FBBC02"
      d="M7.172 13.688c-.375-1.172-.375-2.25 0-3.422L4.219 7.969c-1.078 2.156-1.406 5.203 0 8.015l2.953-2.296Z"
    />
    <path
      fill="#EA4335"
      d="M7.172 10.265c1.031-3.234 5.437-5.109 8.39-2.343l2.579-2.532C14.484 1.875 7.359 2.015 4.219 7.97l2.953 2.296Z"
    />
  </svg>
);
export default SvgComponent;
