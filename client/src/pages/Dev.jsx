import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaGithub, FaLinkedin } from "react-icons/fa";
const developers = [
  {
    name: "Pavan Gollapalli",
    role: "Full Stack Developer",
    description:
      "Experienced developer with a passion for clean code and beautiful UIs.",
    github: "#",
    linkedin: "#",
    image: "https://github.com/gspavan07.png", // replace with actual image
  },
  {
    name: "Sunil Garbana",
    role: "Backend Developer",
    description:
      "Experienced developer with a passion for clean code and beautiful UIs.",
    github: "#",
    linkedin: "#",
    image: "https://github.com/gspavan07.png", // replace with actual image
  },
  {
    name: "Lalu Prasad",
    role: "Frontend Developer",
    description:
      "Expert Python developer specializing in data processing and automation solutions.",
    github: "#",
    linkedin: "#",
    image: "Lalu_pic.jpeg", // replace with actual image
  },
  {
    name: "Kamal Sai Tillari",
    role: "Python Developer",
    description:
      "Expert Python developer specializing in data processing and automation solutions.",
    github: "#",
    linkedin: "#",
    image: "https://github.com/gspavan07.png", // replace with actual image
  },
];

const Dev = () => {
  return (
    <>
      <Navbar />
      <section className="flex flex-col items-center pt-10 text-center min-h-[88vh]">
        <h1 className="text-3xl font-bold mb-2">Meet Our Developers</h1>
        <p className="text-gray-600 mb-10">
          The talented team behind the Student Coding Profile Dashboard
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {developers.map((dev, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg w-96 hover:shadow-xl overflow-hidden transition-shadow"
            >
              <div className="flex ite>ms-center justify-between p-5 bg-gray-200">
                <div className="flex flex-col justify-center items-start">
                  <h2 className="text-xl font-semibold">{dev.name}</h2>
                  <p className="text-sm text-gray-500">{dev.role}</p>
                </div>
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col p-5 justify-between">
                <p className="text-gray-600 text-sm">{dev.description}</p>

                <div className="flex items-center justify-center mt-5 gap-4">
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-gray-200 py-2 px-3 rounded-md text-sm text-gray-700 hover:text-black"
                  >
                    <FaGithub className="mr-1" /> GitHub Profile
                  </a>
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-gray-200 py-2 px-3 rounded-md text-sm text-gray-700 hover:text-black"
                  >
                    <FaLinkedin className="mr-1" /> LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Dev;
