import Image, { StaticImageData } from "next/image";
import React, { useEffect, useRef } from "react";

type Props = {
  title: string;
  description: string;
  align?: "regular" | "reverse";
  imageUrl: string | StaticImageData;
};

function FeatureBlock({
  title,
  description,
  align = "regular",
  imageUrl,
}: Props) {
  const blockRef = useRef(null);

  useEffect(() => {
    if (!blockRef.current) return;

    const target = blockRef.current;
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fadeInLeft");
        }
      });
    }, options);

    observer.observe(target);

    return () => {
      if (target) return;
      observer.unobserve(target);
    };
  }, []);

  const alignClass = {
    regular: "lg:flex-row",
    reverse: "lg:flex-row-reverse",
  };

  return (
    <div
      className={`p-4 flex flex-col gap-4 ${alignClass[align]} justify-between`}
    >
      <div
        ref={blockRef}
        className="feature-block px-8 bg-white rounded-lg border-l-8 h-full flex flex-col justify-center w-min lg:w-8/12"
      >
        <div className="w-[325px] py-8 lg:py-16">
          <h2 className="font-bold text-5xl mb-8">{title}</h2>
          <p className="text-xl">{description}</p>
        </div>
      </div>
      <Image
        className="drop-shadow-xl lg:w-full rounded-lg"
        src={imageUrl}
        alt="cookbook"
      />
    </div>
  );
}

export default FeatureBlock;
