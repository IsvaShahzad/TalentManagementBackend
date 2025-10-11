import React from "react";
import classNames from "classnames";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CProgress,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { cilCloudDownload } from "@coreui/icons";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import WidgetsBrand from "../widgets/WidgetsBrand";
import WidgetsDropdown from "../widgets/WidgetsDropdown";
import "../widgets/WidgetStyles.css";

const Dashboard = () => {
  const progressExample = [
    { title: "Visits", value: "29.703 Users", percent: 40, color: "success" },
    { title: "Unique", value: "24.093 Users", percent: 20, color: "info" },
    { title: "Pageviews", value: "78.706 Views", percent: 60, color: "warning" },
    { title: "New Users", value: "22.123 Users", percent: 80, color: "danger" },
    { title: "Bounce Rate", value: "Average Rate", percent: 40.15, color: "primary" },
  ];

  const candidateStatusData = [
    { name: "Placed", value: 45 },
    { name: "Shortlisted", value: 30 },
    { name: "Waiting", value: 25 },
  ];

  const COLORS = ["#4CAF50", "#FFC107", "#00BCD4"];

  const trafficData = [
    { month: "Jan", Visits: 4000, Unique: 2400, Pageviews: 2400 },
    { month: "Feb", Visits: 3000, Unique: 1398, Pageviews: 2210 },
    { month: "Mar", Visits: 2000, Unique: 9800, Pageviews: 2290 },
    { month: "Apr", Visits: 2780, Unique: 3908, Pageviews: 2000 },
    { month: "May", Visits: 1890, Unique: 4800, Pageviews: 2181 },
    { month: "Jun", Visits: 2390, Unique: 3800, Pageviews: 2500 },
    { month: "Jul", Visits: 3490, Unique: 4300, Pageviews: 2100 },
  ];

  return (
    <>
      {/* --- Widgets Dropdown (Top 4 boxes) --- */}
      <div className="px-2">
        <WidgetsDropdown className="mb-4" />
      </div>

      {/* --- Traffic + Analytics Cards --- */}
      <div className="px-2">
        <CRow className="mb-4 mt-3 gx-2 gy-3 align-items-stretch">
          {/* Traffic Card */}
          <CCol xs={12} md={7} lg={8}>
            <CCard
              className="traffic-card card-elevated"
             style={{
                       height: "480px", // ensures card is at least 480px, but can expand
                       backgroundColor: "#ffffff",
                       border: "none",
                       boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                      }}

            >
              <CCardBody style={{ backgroundColor: "#ffffff" }}>
                <CRow>
                  <CCol sm={7}>
                    <h4 id="traffic" className="card-title mb-0">
                      Traffic
                    </h4>
                    <div className="small text-body-secondary">January - July 2023</div>
                  </CCol>
                  <CCol sm={5} className="d-none d-md-block">
                    <CButton color="primary" className="float-end">
                      <CIcon icon={cilCloudDownload} />
                    </CButton>
                  </CCol>
                </CRow>

                {/* Stacked Area Chart */}
                <div style={{ marginTop: "1.5rem", width: "100%", height: 350 }}>
                  <ResponsiveContainer>
                    <AreaChart
                      data={trafficData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorUnique" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#00BCD4" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPageviews" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFC107" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#FFC107" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="Visits" stackId="1" stroke="#4CAF50" fill="url(#colorVisits)" />
                      <Area type="monotone" dataKey="Unique" stackId="1" stroke="#00BCD4" fill="url(#colorUnique)" />
                      <Area type="monotone" dataKey="Pageviews" stackId="1" stroke="#FFC107" fill="url(#colorPageviews)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CCardBody>

              <CCardFooter style={{ backgroundColor: "#ffffff", borderTop: "1px solid #eee" }}>
                <CRow
                  xs={{ cols: 1, gutter: 4 }}
                  sm={{ cols: 2 }}
                  lg={{ cols: 3 }}
                  className="text-center"
                >
                  {progressExample.map((item, index, items) => (
                    <CCol
                      className={classNames({
                        "d-none d-xl-block": index + 1 === items.length,
                      })}
                      key={index}
                    >
                      <div className="text-body-secondary">{item.title}</div>
                      <div className="fw-semibold text-truncate">
                        {item.value} ({item.percent}%)
                      </div>
                      <CProgress
                        thin
                        className="mt-2"
                        color={item.color}
                        value={item.percent}
                      />
                    </CCol>
                  ))}
                </CRow>
              </CCardFooter>
            </CCard>
          </CCol>

          {/* Analytics Card */}
          <CCol xs={12} md={4} lg={4}>
            <CCard
              className="analytics-card card-elevated text-center"
              style={{
                height: "480px",
                backgroundColor: "#ffffff",
                border: "none",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                display: "flex",
              }}
            >
              <CCardBody style={{ backgroundColor: "#ffffff" }}>
                <h4 className="card-title mb-3">Analytics</h4>
                <div className="small text-body-secondary mb-4">
                  Candidate Status Distribution
                </div>

                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={candidateStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={6}
                        dataKey="value"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {candidateStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "10px",
                          backgroundColor: "rgba(255, 255, 255, 0.95)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>

      {/* --- Existing Widgets Brand --- */}
      <div className="px-2">
        <WidgetsBrand className="mb-4" withCharts />
      </div>
    </>
  );
};

export default Dashboard;
