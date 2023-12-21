import React,{useEffect} from "react";
import Image12 from '../../../assets/map1.jpg'
import Image13 from '../../../assets/contact1.jpg'
import mapboxgl from 'mapbox-gl';


const ContactUs = () => {
 
    useEffect(() => {
      mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN'; // Set your Mapbox access token here
  
      const map = new mapboxgl.Map({
        container: 'map', // Specify the HTML element ID where you want to render the map
        style: 'mapbox://styles/mapbox/streets-v11', // Replace with your preferred map style
        center: [76.2673, 9.9312], // Set the initial center of the map [longitude, latitude]
        zoom: 12, // Set the initial zoom level
      });
  
      // Add navigation controls (optional)
      map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  
      // Clean up map instance on component unmount
      return () => map.remove();
    }, []); // Run this effect only once on component mount
  

  
  return (
    <div>
    

  

    <div className="bg-gray-100 py-10">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
        <div className="w-16 h-1 bg-blue-500 mx-auto mt-2"></div>
        <br/><br/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:order-2">
            <img
              src={Image13}
              alt="Contact Us"
              className="w-full rounded-lg"
            />
          </div>
 
          <div className="md:order-1">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <p className="mb-4">
                <strong>Address:</strong> 123 Main Street, Kochi, India
              </p>
              <p className="mb-4">
                <strong>Phone:</strong> +0 (123) 456-7890
              </p>
              <p className="mb-4">
                <strong>Email:</strong> info@luxuryhotel.com
              </p>

              <h2 className="text-xl font-semibold mb-4">Location</h2>
              <p className="mb-4">Find us on the map below:</p>
              <img
                src= {Image12}
                alt="Hotel Location"
                className="w-full rounded-lg"
              />
               <div id="map" style={{ width: '100%', height: '400px' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ContactUs;