import React from 'react'

export default function Title({title}) {
    return (
        <div className="text-center my-5">
  <h1 className="text-4xl font-bold text-gray-800">
    {title}
  </h1>
  <div className="w-16 h-1 bg-blue-500 mx-auto mt-2"></div>
</div>
    )
}