import React, { useState, useEffect, useCallback } from "react";
import layer7 from "../../src/Assets/icons/Layer7.png";
import layer3 from "../../src/Assets/icons/Layer3.png";
import layer8 from "../../src/Assets/icons/Layer8.png";
import layer1 from "../../src/Assets/icons/Layer1.png";
import layer6 from "../../src/Assets/icons/Layer6.png";
import arrow from "../../src/Assets/icons/arrow.png";
import calendar from "../../src/Assets/icons/calendar.png";
import "react-datepicker/dist/react-datepicker.css";
import NoReport from "./NoReport";
import ProjectsPage from "./ProjectsPage";

const MainPage = () => {
  const [projects, setProjects] = useState([]); //store projects info
  const [gateways, setGateways] = useState([]); //store gateway info
  const [usersInfo, setUsersInfo] = useState([]); //store usersInfo infoapi

  const [shownProjectName, setShowProject] = useState("Select Project");
  const [shownGatewayName, setGateway] = useState("Select Gateway");
  const [showNoData, setShowNoData] = useState(0);
  const [counter, setCounter] = useState(1);
  const [clickedGenerate, setClickedGenerate] = useState(1);

  //filters section
  const listViewProjects = () => {
    return (
      <div className="dropdown-content">
        <a
          href="#allProject"
          onClick={() => {
            setShowProject("All Project");
          }}
          className="a-types-drop"
        >
          All projects
        </a>
        {projects.map((value, id) => {
          return (
            <a
              href="#values"
              key={value + id.toString()}
              onClick={() => {
                setShowProject(value[0]);
              }}
              className="a-types-drop"
            >
              {value[0]}
            </a>
          );
        })}
      </div>
    );
  };
  const listViewGateways = () => {
    return (
      <div className="dropdown-content-2">
        <a
          href="#allProject"
          onClick={() => {
            setGateway("All Gateways");
          }}
          className="a-types-drop"
        >
          All Gateways
        </a>
        {gateways.map((value, id) => {
          return (
            <a
              href="#values"
              key={value + id.toString()}
              onClick={() => {
                setGateway(value[0]);
              }}
              className="a-types-drop"
            >
              {value[0]}
            </a>
          );
        })}
      </div>
    );
  };

  //render when only clicked to generate button
  const renderProjectDetail = useCallback(() => {
    if (
      shownProjectName !== "Select Project" &&
      shownProjectName !== "Select Gateway"
    )
      return (
        <ProjectsPage
          project={projects}
          gateway={gateways}
          filterProject={shownProjectName}
          filterGateway={shownGatewayName}
          clicked={showNoData}
        />
      );
  }, [clickedGenerate]);

  // show no data case
  useEffect(() => {
    if (
      (shownProjectName === "Select Project") &
      (shownGatewayName === "Select Gateway")
    ) {
      setShowNoData(0);
    } else {
      setShowNoData(showNoData + 1);
    }
  }, [clickedGenerate]);

  //get projects && gateway info from api
  const getAllData = () => {
    let project_names = [];
    let gateway_names = [];
    fetch("http://178.63.13.157:8090/mock-api/api/projects")
      .then((res) => res.json())
      .then((result) => {
        result.data.forEach((value) => {
          project_names.push([value.name, value.projectId]);
        });
      });
    setProjects(project_names);
    fetch("http://178.63.13.157:8090/mock-api/api/gateways")
      .then((res) => res.json())
      .then((result) => {
        result.data.forEach((value) => {
          gateway_names.push([value.name, value.gatewayId]);
        });
      });

    setGateways(gateway_names);
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    if (counter < 4) {
      setTimeout(() => {
        setCounter(counter + 1);
      }, 100);
    }
  }, [counter]);

  return (
    <div className="main-page ">
      <div className="left-side">
        <div className="left-icon1">
          <img src={layer7} alt="logo" />
        </div>
        <div className="left-icon2">
          <img src={layer3} alt="logo" />
        </div>
        <div className="left-icon3">
          <img src={layer8} alt="logo" />
        </div>
        <div className="left-icon4">
          <img src={layer1} alt="logo" />
        </div>
        <div className="left-icon5">
          <img src={layer6} alt="logo" />
        </div>
      </div>
      <div className="right-side">
        <div className="right-top ">
          <div className="right-report">
            <div>Reports</div>
          </div>
          <div className="right-report-sub">
            <p>Easily generate a report of your transactions</p>
          </div>
          <div className="text-styles-buttons">
            <div className="dropdown">
              <button className="right-button1" onClick={() => {}}>
                {shownProjectName}
                <img src={arrow} className="img-in-buttons" />
              </button>
              {listViewProjects()}
            </div>
            <div className="dropdown-2">
              <button className="right-button2" onClick={() => {}}>
                {shownGatewayName}
                <img src={arrow} className="img-in-buttons" />
              </button>
              {listViewGateways()}
            </div>
            <button className="right-button3">
              From date <img src={calendar} className="img-in-buttons" />
            </button>
            <button className="right-button4">
              To date <img src={calendar} className="img-in-buttons" />
            </button>
            <button
              className="right-button5"
              onClick={() => {
                setClickedGenerate(clickedGenerate + 1);
                setShowNoData(showNoData + 1);
              }}
            >
              Generate report
            </button>
          </div>
        </div>
        {showNoData === 0 ? <NoReport /> : renderProjectDetail()}
      </div>
      <div className="terms-style">
        Terms&Conditions | Privacy policy Typography
      </div>
    </div>
  );
};

export default MainPage;
