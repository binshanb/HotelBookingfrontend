import React from 'react';
import Image11 from '../../../assets/about.jpg'


const AboutUs = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-800">About Our Hotel</h1>
        <div className="w-16 h-1 bg-blue-500 mx-auto mt-2"></div>
        <div className="bg-white shadow-md p-4 rounded-lg">  
<p className="text-lg mb-6 text-gray-700">
  Welcome to our luxurious hotel. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.
</p>

<p className="text-lg mb-6 text-gray-700">
  Phasellus vestibulum. Fusce pellentesque, purus nec interdum. Sed lacinia, urna non tincidunt mattis,
  tortor neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut fringilla.
</p>

<p className="text-lg mb-6 text-gray-700">
  Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet. Vestibulum sapien. Proin quam. Etiam ultrices.
</p>

</div>
<div className="bg-white shadow-md p-4 rounded-lg">
      <img
        src= {Image11}
        alt="Hotel Image"
        className="w-full max-w-lg mx-auto mb-8"
      />
     </div>
     <div className="bg-white shadow-md p-4 rounded-lg">
      <p className="text-lg">
        At our hotel, we are committed to providing you with the best experience. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse potenti.
      </p>
      </div>
    </div>
  );
};

export default AboutUs;