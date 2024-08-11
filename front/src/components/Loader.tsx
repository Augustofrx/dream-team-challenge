import React from "react";
import Image from "next/image";
import LoadingCircle from "../../public/loading-circle.svg";

const Loader = () => {
  return (
    <div className=" flex flex-col justify-center items-center h-full w-full py-12 md:py-20">
      <Image
        src={LoadingCircle}
        alt="Loading"
        width={50}
        height={50}
        priority
      />
      <span className="text-white">Cargando...</span>
    </div>
  );
};

export default Loader;
