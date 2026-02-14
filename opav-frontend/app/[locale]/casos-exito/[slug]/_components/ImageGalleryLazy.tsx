"use client";

import dynamic from "next/dynamic";

const ImageGallery = dynamic(() => import("./ImageGallery"), {
  loading: () => <div className="min-h-[300px] bg-white animate-pulse" />,
  ssr: false,
});

export default ImageGallery;
