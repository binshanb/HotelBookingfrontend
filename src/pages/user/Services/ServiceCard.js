import React from "react";

export default function ServiceCard({ service, title, details, image }) {
  return (
    <div className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4">
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <img src={image} alt={title} className="w-16 h-16 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 text-sm mb-4">{details}</p>
      {service}
    </div>
  </div>
  );
}
