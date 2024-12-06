import React from "react";
import {ReactTyped} from "react-typed"; // Ensure the latest React-Typed library is installed
import { Player } from "@lottiefiles/react-lottie-player"; // Ensure the latest Lottie Player library is installed

function Home () {
  return (
    <div className="bg-blue-500 w-full min-h-screen pt-[50px] flex flex-col items-center">
      {/* Lottie Animation */}
      <Player
        src="https://lottie.host/c2220e3c-f4d5-44b1-aabf-586997503c50/ciSTnIwdvU.json"
        className="player"
        loop
        autoplay
        style={{ height: "300px", width: "300px" }}
      />
      
      {/* Content Section */}
      <div className="max-w-[1240px] my-8 font-bold mx-auto text-center">
        {/* Heading */}
        <div className="text-xl md:text-3xl mb-4 text-white">
          Create with us
        </div>
        <h2 className="text-white text-[30px] md:text-[60px]">
          Build with us
        </h2>
        
        {/* Subheading with Typed Animation */}
        <div className="text-[20px] md:text-[40px] text-white mt-4">
          Let's Revolutionize
          <ReactTyped
            className="pl-2"
            strings={["Form Customization", "Form Building", "Form Sharing"]}
            typeSpeed={100}
            loop
            backSpeed={50}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
