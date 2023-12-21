import React from "react";
import Title from "./Title";
import ServiceCard from "./ServiceCard";
import { FaCocktail, FaBeer, FaShuttleVan, FaHiking } from "react-icons/fa";
import Image1 from '../../../assets/service1.jpg'
import Image2 from '../../../assets/service2.jpg'
import Image3 from '../../../assets/service3.jpg'
import Image4 from '../../../assets/service4.jpg'


export default function Services() {
  const serviceList = [
    {
      image: Image1,
      serviceName: <FaCocktail />,
      title: "Free Cocktail",
      details:
      "Some quick example text to build on the card title and make up the bulk of the card's content.Some quick example text to build on the card title and make up",
    
    },
    {
      image: Image2,
      serviceName: <FaBeer />,
      title: "Free Beer",
      details:
        "Some quick example text to build on the card title and make up the bulk of the card's content.Some quick example text to build on the card title and make up",
    },
    {
      image: Image3,
      serviceName: <FaShuttleVan />,
      title: "Free Shuttle Van",
      details:
        "Some quick example text to build on the card title and make up the bulk of the card's content.Some quick example text to build on the card title and make up",
    },
    {
      image: Image4,
      serviceName: <FaHiking />,
      title: "Free Hiking",
      details:
        "Some quick example text to build on the card title and make up the bulk of the card's content.Some quick example text to build on the card title and make up",
    },
  ];

  return (
    
    <React.Fragment>
      <Title title="Services" />
      <div className="flex flex-wrap justify-center">
        {serviceList.map((service, index) => (
          <ServiceCard
            service={service.serviceName}
            title={service.title}
            details={service.details}
            image={service.image}
            key={index}
            className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-4"
          />))
        }
      </div>
      </React.Fragment>
  );
        }

