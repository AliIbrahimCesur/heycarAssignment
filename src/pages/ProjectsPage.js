import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import chartData from "../consts/chartData.js";
ChartJS.register(ArcElement, Tooltip, Legend);

const ProjectsPage = (props) => {
  const [projects, setProjects] = useState(props.project);
  const [gateways, setGateway] = useState(props.gateway);
  const [filterprojects, setFilterProjects] = useState(props.filterProject); //get selected project name
  const [filtergateways, setFilterGateway] = useState(props.filterGateway); //get selected gateway name

  const [dataArr, setDataArr] = useState([]); //for store all data
  const [dataArrOneToOne, setDataArrOneToOne] = useState([]); //for store one to one filter
  const [dataArrOneToAll, setDataArrOneToAll] = useState([]); //for store one to all filter
  const [dataArrAllToOne, setDataArrAllToOne] = useState([]); //for store all to all filter

  useEffect(() => {
    setFilterProjects(props.filterProject);
    setFilterGateway(props.filterGateway);
    setProjects(props.project);
    setGateway(props.gateway);
    setDataArr([]);
    setDataArrOneToOne([]);
    setDataArrOneToAll([]);
    setDataArrAllToOne([]);
  }, [props.clicked]); // render when clicked generate

  // filter name from all
  const prId = () => {
    if (filterprojects === "All Project") {
    } else {
      return projects
        .filter((val) => val[0] === filterprojects)[0][1]
        .toString();
    }
  };
  const gtId = () => {
    if (filtergateways === "All Gateways") {
    } else {
      return gateways
        .filter((val) => val[0] === filtergateways)[0][1]
        .toString();
    }
  };

  //fetch data from url by selections
  useEffect(() => {
    if (filtergateways !== "All Gateways" && filterprojects !== "All Project") {
      let _data = {
        from: "2021-01-01",
        to: "2021-12-31",
        projectId: prId(),
        gatewayId: gtId(),
      };
      fetch("http://178.63.13.157:8090/mock-api/api/report", {
        method: "POST",
        body: JSON.stringify(_data),
        headers: { "Content-type": "application/json; charset=UTF-8" },
      })
        .then((response) => response.json())
        .then((json) => {
          setDataArrOneToOne(json.data);
        });
    } else if (
      filtergateways === "All Gateways" &&
      filterprojects !== "All Project"
    ) {
      gateways.forEach((value) => {
        let _data = {
          from: "2021-01-01",
          to: "2021-12-31",
          projectId: prId(),
          gatewayId: value[1],
        };
        fetch("http://178.63.13.157:8090/mock-api/api/report", {
          method: "POST",
          body: JSON.stringify(_data),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        })
          .then((response) => response.json())
          .then((json) => {
            setDataArrOneToAll((dataArr) => [...dataArr, json.data]);
          });
      });
    } else if (
      filtergateways !== "All Gateways" &&
      filterprojects === "All Project"
    ) {
      projects.forEach((value) => {
        let _data = {
          from: "2021-01-01",
          to: "2021-12-31",
          projectId: value[1],
          gatewayId: gtId(),
        };
        fetch("http://178.63.13.157:8090/mock-api/api/report", {
          method: "POST",
          body: JSON.stringify(_data),
          headers: { "Content-type": "application/json; charset=UTF-8" },
        })
          .then((response) => response.json())
          .then((json) => {
            setDataArrAllToOne((dataArr) => [...dataArr, json.data]);
          });
      });
    } else if (
      filtergateways === "All Gateways" &&
      filterprojects === "All Project"
    ) {
      projects.forEach((value) => {
        gateways.forEach((element) => {
          let _data = {
            from: "2021-01-01",
            to: "2021-12-31",
            projectId: value[1],
            gatewayId: element[1],
          };
          fetch("http://178.63.13.157:8090/mock-api/api/report", {
            method: "POST",
            body: JSON.stringify(_data),
            headers: { "Content-type": "application/json; charset=UTF-8" },
          })
            .then((response) => response.json())
            .then((json) => {
              dataArr.includes(json.data)
                ? console.log("not now!")
                : setDataArr((dataArr) => [...dataArr, json.data]);
            });
        });
      });
    }
  }, [props]);

  const dataResize = (arr) => {
    let item_1 = [];
    let item_2 = [];
    arr.forEach((value) =>
      value.forEach((element) =>
        element.projectId === "bgYhx"
          ? item_1.push([
              element.modified,
              element.gatewayId,
              element.userIds,
              element.amount,
            ])
          : item_2.push([
              element.modified,
              element.gatewayId,
              element.userIds,
              element.amount,
            ])
      )
    );

    if (item_1.length === 0) {
      return [item_2];
    } else {
      return [item_1, item_2];
    }
  };

  const renderData = () => {
    let neww = [];
    neww = dataArr.slice(0, dataArr.length / 2);

    if (filterprojects === "All Project" && filtergateways === "All Gateways") {
      neww = dataArr.slice(0, dataArr.length / 2);
      let item_1 = [];
      item_1 = dataResize(neww);
      let total = 0;

      return (
        <div>
          <div className="detail-main-full">
            <div className="mini-breadcrumb">
              {filterprojects} | {filtergateways}
            </div>

            {item_1.map((element, index) => {
              return (
                <div className={index === 0 ? "full-header-main" : ""}>
                  <div className={"full-header"}>
                    <div className="full-header-1">{projects[index][0]}</div>

                    <div className="full-header-2">
                      Total{" "}
                      {total === 0
                        ? null
                        : total.toFixed(4).toString().replace(".", ",")}
                    </div>
                  </div>
                  {index === 0 ? (
                    <div className="detail-big">
                      <div className="container-scroll">
                        <div className="box-scroll">
                          {element.map((value, id) => {
                            total += value[3];
                            return (
                              <div>
                                {id === 0 ? (
                                  <div className={"detail-style-2"}>
                                    <div className="date-style-2">Date</div>
                                    <div className="gateway-style-2">
                                      Gateway
                                    </div>

                                    <div className="userId-style-2">
                                      Transaction ID
                                    </div>
                                    <div className="amount-style-2">Amount</div>
                                  </div>
                                ) : null}
                                <div
                                  className={
                                    id % 2 === 0
                                      ? "detail-style"
                                      : "detail-style-2"
                                  }
                                >
                                  <div className="date-style-2">
                                    {value[0].toString().replace(/-/g, "/")}
                                  </div>
                                  <div className="gateway-style-2">
                                    {value[1] === "i6ssp"
                                      ? "Gateway 1"
                                      : "Gateway 2"}
                                  </div>
                                  <div className="userId-style-2">
                                    {value[2].toString()}
                                  </div>
                                  <div className="amount-style-2">
                                    {value[3]
                                      .toFixed(4)
                                      .toString()
                                      .replace(".", ",")}{" "}
                                    USD
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="detail-total-full">
            <div className="detail-total-full-text">
              TOTAL | {total.toFixed(4).toString().replace(".", ",")} USD
            </div>
          </div>
        </div>
      );
    } else if (
      filterprojects !== "All Project" &&
      filtergateways !== "All Gateways"
    ) {
      let total = 0;

      return (
        <div>
          <div className="detail-main">
            <div className="mini-breadcrumb">
              {filterprojects} | {filtergateways}
            </div>
            <div className="datail-big-down">
              <div className="detail-big">
                <div className="container-scroll">
                  <div className="box-scroll">
                    {dataArrOneToOne.map((value, id) => {
                      total += value.amount;
                      return (
                        <div>
                          {id === 0 ? (
                            <div className={"detail-style-2"}>
                              <div className="date-style">Date</div>
                              <div className="userId-style">Transaction ID</div>
                              <div className="amount-style">Amount</div>
                            </div>
                          ) : null}
                          <div
                            className={
                              id % 2 === 0 ? "detail-style" : "detail-style-2"
                            }
                          >
                            <div className="date-style">
                              {value.created.toString().replace(/-/g, "/")}
                            </div>
                            <div className="userId-style">
                              {value.userIds.toString()}
                            </div>
                            <div className="amount-style">
                              {value.amount
                                .toFixed(4)
                                .toString()
                                .replace(".", ",")}{" "}
                              USD
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="detail-total">
            <div className="detail-total-text">
              TOTAL | {total.toFixed(4).toString().replace(".", ",")} USD
            </div>
          </div>
        </div>
      );
    } else if (
      filterprojects !== "All Project" &&
      filtergateways === "All Gateways"
    ) {
      let total = 0;

      neww = dataArrOneToAll.slice(0, dataArrOneToAll.length / 2);
      let item_1 = [];
      item_1 = dataResize(neww);

      return (
        <div>
          <div className="detail-main-full-v3">
            <div className="mini-breadcrumb">
              {filterprojects} | {filtergateways}
            </div>

            {item_1.map((element, index) => {
              return (
                <div className={index === 0 ? "full-header-main-v3" : ""}>
                  <div className={"full-header-v3"}>
                    <div className="full-header-1-v3">{gateways[index][0]}</div>

                    <div className="full-header-2-v3">
                      Total{" "}
                      {total === 0
                        ? null
                        : total.toFixed(4).toString().replace(".", ",")}
                    </div>
                  </div>
                  {index === 0 ? (
                    <div className="detail-big">
                      <div className="container-scroll">
                        <div className="box-scroll">
                          {element.map((value, id) => {
                            total += value[3];
                            return (
                              <div>
                                {id === 0 ? (
                                  <div className={"detail-style-3"}>
                                    <div className="date-style-3">Date</div>
                                    <div className="userId-style-3">
                                      Transaction ID
                                    </div>
                                    <div className="amount-style-3">Amount</div>
                                  </div>
                                ) : null}
                                <div
                                  className={
                                    id % 2 === 0
                                      ? "detail-style-3-v2"
                                      : "detail-style-3"
                                  }
                                >
                                  <div className="date-style-3">
                                    {value[0].toString().replace(/-/g, "/")}
                                  </div>
                                  <div className="userId-style-3">
                                    {value[2].toString()}
                                  </div>
                                  <div className="amount-style-3">
                                    {value[3]
                                      .toFixed(4)
                                      .toString()
                                      .replace(".", ",")}{" "}
                                    USD
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="detail-total-full">
            <div className="detail-total-full-text">
              TOTAL | {total.toFixed(4).toString().replace(".", ",")} USD
            </div>
          </div>
          <div className="temptheme">
            <div className="right-part-1">
              <div className="mini-box-right-1-1">
                <div className="mini-box-right1"></div>
                <div>Stripe</div>
              </div>
              <div className="mini-box-right-1-1">
                <div className="mini-box-right2"></div>
                <div>Authorize.NET</div>
              </div>
              <div className="mini-box-right-1-1">
                <div className="mini-box-right3"></div>
                <div>Gateway 1</div>
              </div>
              <div className="mini-box-right-1-1">
                <div className="mini-box-right4"></div>
                <div>Gateway 2</div>
              </div>
            </div>
            <div className="right-part-2">
              <div className="doughnut-box">
                <Doughnut data={chartData} />
              </div>
            </div>
            <div className="right-part-3">
              PROJECT TOTAL | {total.toFixed(4).toString().replace(".", ",")}{" "}
              USD
            </div>
          </div>
        </div>
      );
    } else if (
      filterprojects === "All Project" &&
      filtergateways !== "All Gateways"
    ) {
      neww = dataArrAllToOne.slice(0, dataArrAllToOne.length / 2);
      let item_1 = [];
      item_1 = dataResize(neww);
      let total = 0;

      return (
        <div>
          <div className="detail-main-full-v3">
            <div className="mini-breadcrumb">
              {filterprojects} | {filtergateways}
            </div>

            {item_1.map((element, index) => {
              return (
                <div className={index === 0 ? "full-header-main-v3" : ""}>
                  <div className={"full-header-v3"}>
                    <div className="full-header-1-v3">{projects[index][0]}</div>

                    <div className="full-header-2-v3">
                      Total{" "}
                      {total === 0
                        ? null
                        : total.toFixed(4).toString().replace(".", ",")}
                    </div>
                  </div>
                  {index === 0 ? (
                    <div className="detail-big">
                      <div className="container-scroll">
                        <div className="box-scroll">
                          {element.map((value, id) => {
                            total += value[3];
                            return (
                              <div>
                                {id === 0 ? (
                                  <div className={"detail-style-3"}>
                                    <div className="date-style-3">Date</div>
                                    <div className="userId-style-3">
                                      Transaction ID
                                    </div>
                                    <div className="amount-style-3">Amount</div>
                                  </div>
                                ) : null}
                                <div
                                  className={
                                    id % 2 === 0
                                      ? "detail-style-3-v2"
                                      : "detail-style-3"
                                  }
                                >
                                  <div className="date-style-3">
                                    {value[0].toString().replace(/-/g, "/")}
                                  </div>
                                  <div className="userId-style-3">
                                    {value[2].toString()}
                                  </div>
                                  <div className="amount-style-3">
                                    {value[3]
                                      .toFixed(4)
                                      .toString()
                                      .replace(".", ",")}{" "}
                                    USD
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
          <div className="detail-total-full">
            <div className="detail-total-full-text">
              TOTAL | {total.toFixed(4).toString().replace(".", ",")} USD
            </div>
          </div>
          <div className="temptheme">
            <div className="right-part-1">
              <div className="mini-box-right-1-1">
                <div className="mini-box-right1"></div>
                <div className="mini-box-rightAll-text">Stripe</div>
              </div>
              <div className="mini-box-right-1-1">
                <div className="mini-box-right2"></div>
                <div className="mini-box-rightAll-text">Authorize.NET</div>
              </div>
              <div className="mini-box-right-1-1">
                <div className="mini-box-right3"></div>
                <div className="mini-box-rightAll-text">Gateway 1</div>
              </div>
              <div className="mini-box-right-1-1">
                <div className="mini-box-right4"></div>
                <div className="mini-box-rightAll-text">Gateway 2</div>
              </div>
            </div>
            <div className="right-part-2">
              <div className="doughnut-box">
                <Doughnut data={chartData} />
              </div>
            </div>
            <div className="right-part-3">PROJECT TOTAL | 14,065 USD</div>
          </div>
        </div>
      );
    } else {
      return <div>bisey yok</div>;
    }
  };
  return <div>{renderData()}</div>;
};

export default ProjectsPage;
