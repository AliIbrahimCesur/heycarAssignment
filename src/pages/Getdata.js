import React, { useState, useEffect } from "react";
import filter from "../../src/Assets/icons/filter.png";
import bbrand from "../../src/Assets/icons/bbrand.png";

const Getdata = () => {
  const [projects, setProjects] = useState([]);
  const [gateways, setGateways] = useState([]);
  const getAllData = () => {
    let project_names = [];
    let gateway_names = [];

    fetch("http://178.63.13.157:8090/mock-api/api/projects")
      .then((res) => res.json())
      .then((result) => {
        result.data.forEach((value) => {
          project_names.push(value.name);
          /* projects.push(value);
              setProjects(projects); */
        });
      });
    setProjects(project_names);
    fetch("http://178.63.13.157:8090/mock-api/api/gateways")
      .then((res) => res.json())
      .then((result) => {
        result.data.forEach((value) => {
          gateway_names.push(value.name);
          /* projects.push(value);
              setProjects(projects); */
        });
      });

    setGateways(gateway_names);
  };
  useEffect(() => {
    getAllData();
  }, []);
  useEffect(() => {
    console.log("projects", projects);
    console.log("projects", projects[0]);

    console.log("projects", gateways);
  }, []);
  return (
    <div className="dropdown-content">
      <a
        href="#"
        onClick={() => {
          setProjects("All Project");
          console.log("all clicked");
        }}
      >
        All projects
      </a>
      <a href="#">{projects.length !== 0 ? projects[0] : "No 1"}</a>
      <a href="#">{projects.length !== 0 ? projects[1] : "No 2"}</a>
    </div>
  );
};

export default Getdata;
