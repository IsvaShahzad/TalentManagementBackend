import React, { useState, useEffect } from "react";
import classNames from "classnames";
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
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
  BarChart,
  Bar,
  Legend,
} from "recharts";

import WidgetsDropdown from "../widgets/WidgetsDropdown";
import "../widgets/WidgetStyles.css";

const Dashboard = () => {
  // Progress section values
  const progressExample = [
    { title: "Placed", value: "0 Jobs", percent: 30, color: "success" },
    { title: "Pending", value: "0 Jobs", percent: 30, color: "warning" },
    { title: "Completed", value: "0 Jobs", percent: 80, color: "info" },
  ];

  // Candidate Status Pie chart data
  const candidateStatusData = [
    { name: "Shortlisted", value: 20 },
    { name: "Placed", value: 20 },
    { name: "Waiting", value: 15 },
  ];
  const statsData = [
  { name: "Mon", value: 30 },
  { name: "Tue", value: 45 },
  { name: "Wed", value: 50 },
  { name: "Thu", value: 38 },
  { name: "Fri", value: 60 },
];



  const COLORS = ["#619963ff", "#d55883ff", "#6cb3bcff"];

  // Traffic (Jobs) chart data for entire year
  const [trafficData, setTrafficData] = useState([
    { month: "Jan", Placed: 400, Pending: 200, Completed: 300 },
    { month: "Feb", Placed: 450, Pending: 180, Completed: 320 },
    { month: "Mar", Placed: 420, Pending: 150, Completed: 350 },
    { month: "Apr", Placed: 480, Pending: 210, Completed: 380 },
    { month: "May", Placed: 500, Pending: 190, Completed: 410 },
    { month: "Jun", Placed: 470, Pending: 160, Completed: 390 },
    { month: "Jul", Placed: 520, Pending: 180, Completed: 430 },
    { month: "Aug", Placed: 510, Pending: 170, Completed: 420 },
    { month: "Sep", Placed: 480, Pending: 160, Completed: 400 },
    { month: "Oct", Placed: 530, Pending: 150, Completed: 450 },
    { month: "Nov", Placed: 540, Pending: 140, Completed: 470 },
    { month: "Dec", Placed: 560, Pending: 130, Completed: 490 },
  ]);

  const [progressData, setProgressData] = useState(progressExample);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      loggedIn: "10:00 AM",
      loggedOut: "6:00 PM",
      role: "Admin",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      loggedIn: "9:30 AM",
      loggedOut: "5:45 PM",
      role: "Recruiter",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      loggedIn: "11:00 AM",
      loggedOut: "7:00 PM",
      role: "User",
    },
  ]);

  // Calculate totals automatically
  useEffect(() => {
    const totalPlaced = trafficData.reduce((sum, item) => sum + item.Placed, 0);
    const totalPending = trafficData.reduce((sum, item) => sum + item.Pending, 0);
    const totalCompleted = trafficData.reduce((sum, item) => sum + item.Completed, 0);

    const updatedProgress = progressExample.map((item) => {
      switch (item.title) {
        case "Placfed":
          return { ...item, value: `${totalPlaced} Jobs` };
        case "Pending":
          return { ...item, value: `${totalPending} Jobs` };
        case "Completed":
          return { ...item, value: `${totalCompleted} Jobs` };
        default:
          return item;
      }
    });
    setProgressData(updatedProgress);
  }, [trafficData]);

  return (
    <>
      {/* Widgets Dropdown */}
      <div className="px-2">
        <WidgetsDropdown className="mb-4" />
      </div>

      {/* Traffic + Analytics */}
      <div className="px-2">
        <CRow className="mb-4 mt-3 gx-2 gy-3 align-items-stretch">
          {/* Traffic Card */}
          <CCol xs={12} md={7} lg={8}>
            <CCard
              className="traffic-card card-elevated"
              style={{
                height: "480px",
                backgroundColor: "#ffffff",
                border: "none",
                boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
                marginTop: "-5px", 

              }}
            >
              <CCardBody style={{ backgroundColor: "#ffffff" }}>
                <CRow>
                  <CCol sm={7}>
                    <h4 id="traffic" className="card-title mb-0">
                      Jobs Overview
                    </h4>
                    <div className="small text-body-secondary">January - December</div>
                  </CCol>
                  <CCol sm={5} className="d-none d-md-block">
                    <CButton color="primary" className="float-end">
                      <CIcon icon={cilCloudDownload} />
                    </CButton>
                  </CCol>
                </CRow>

                {/* Area Chart */}
                <div style={{ marginTop: "1.5rem", width: "100%", height: 350 }}>
                  <ResponsiveContainer>
                    <AreaChart data={trafficData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorPlaced" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FFC107" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#FFC107" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#00BCD4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="month" />
                      <YAxis />
                      {/* <CartesianGrid strokeDasharray="3 3" /> */}
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="Placed" stroke="#4CAF50" fill="url(#colorPlaced)" />
                      <Area type="monotone" dataKey="Pending" stroke="#eec23cff" fill="url(#colorPending)" />
                      <Area type="monotone" dataKey="Completed" stroke="#00BCD4" fill="url(#colorCompleted)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CCardBody>

             

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
                marginTop: "-5px", // 👈 moves the box slightly upward

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
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {candidateStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
{/* Recent Activity + Stats Side by Side */}
<div className="px-2">
  <CRow className="mb-4 mt-3 gx-3 gy-3 align-items-stretch">
    {/* Recent Activity */}
    <CCol xs={12} lg={6}>
      <CCard
        className="card-elevated"
        style={{
          backgroundColor: "#ffffff",
          border: "none",
          borderRadius: "16px",
          boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
          marginTop: "-15px",
          height: "100%", 

        }}
      >
        <CCardBody
          style={{
            backgroundColor: "#ffffff",
            padding: "1.5rem 1.5rem 0.5rem 1.5rem",
          }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5
              className="card-title mb-0"
              style={{ color: "#333", fontWeight: "600" }}
            >
              Recent Activity
            </h5>

            <div className="d-flex align-items-center gap-2">
              <small style={{ color: "#777" }}>
                Updated on: {new Date().toLocaleString()}
              </small>
              <CButton
                color="light"
                size="sm"
                style={{
                  borderRadius: "50%",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                }}
                onClick={() => window.location.reload()}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "rotate(90deg)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "rotate(0deg)")
                }
              >
                <CIcon icon={cilCloudDownload} style={{ color: "#333" }} />
              </CButton>
            </div>
          </div>

          {/* Activity List */}
          <div className="d-flex flex-column gap-3 mt-3 mb-4">
            {[
              {
                iconBg: "#e3f2fd",
                iconColor: "#0d47a1",
                text: "New Job Posting Added",
                user: "Alice Johnson",
                time: "2 mins ago",
              },
              {
                iconBg: "#fff3cd",
                iconColor: "#856404",
                text: "Candidate Shortlisted",
                user: "Bob Smith",
                time: "10 mins ago",
              },
              {
                iconBg: "#e8f5e9",
                iconColor: "#1b5e20",
                text: "System Update Completed",
                user: "System Bot",
                time: "30 mins ago",
              },
              {
                iconBg: "#fce4ec",
                iconColor: "#ad1457",
                text: "New Recruiter Registered",
                user: "Sarah Lee",
                time: "1 hour ago",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="d-flex align-items-center justify-content-between p-3"
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 2px 8px rgba(0,0,0,0.05)";
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    style={{
                      width: "42px",
                      height: "42px",
                      borderRadius: "10px",
                      backgroundColor: activity.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CIcon
                      icon={cilCloudDownload}
                      size="lg"
                      style={{ color: activity.iconColor }}
                    />
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", color: "#333" }}>
                      {activity.text}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#777" }}>
                      {activity.user}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "0.8rem",
                    color: "#999",
                  }}
                >
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CCardBody>
      </CCard>
    </CCol>

 {/* Stats Section */}
<CCol xs={12} lg={6}>
  <CCard
    className="card-elevated"
    style={{
      backgroundColor: "#ffffff",
      border: "none",
      borderRadius: "16px",
      boxShadow: "0 6px 16px rgba(0,0,0,0.1)",
      marginTop: "-15px",
      height: "100%",
      textAlign: "start",
    }}
  >
    <CCardBody style={{ backgroundColor: "#ffffff", padding: "1.5rem" }}>
      <h5 className="mb-4" style={{ color: "#333", fontWeight: "600", textAlign: "start" }}>
        Weekly Submissions
      </h5>

      {/* Stats Chart */}
      <div
        style={{
          height: "360px",
          marginTop: "20px",
        }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={[
              { name: "Mon", jobs: 12 },
              { name: "Tue", jobs: 18 },
              { name: "Wed", jobs: 10 },
              { name: "Thu", jobs: 22 },
              { name: "Fri", jobs: 15 },
              { name: "Sat", jobs: 9 },
              { name: "Sun", jobs: 14 },
            ]}
            margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
          >
            {/* <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" /> */}
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                border: "none",
              }}
            />
            <Bar
              dataKey="jobs"
              barSize={55}
              fill="#92c6afff"
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CCardBody>
  </CCard>
</CCol>


  </CRow>
</div>

{/* Users Table */}
<CCard
  className="card-elevated"
  style={{
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 24px rgba(0,0,0,0.)",
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "18px",
    width: "100%",
  }}
>
<CCardBody
  style={{
    backgroundColor: "#ffffff",
    padding: "1.5rem 1.5rem 0.5rem 1.5rem",
  }}
>
  <h5
    className="card-title mb-4"
    style={{ color: "#333", fontWeight: "600" }}
  >
    Users
  </h5>

  <div className="d-flex flex-column gap-3">
    {users.map((user, index) => (
      <div
        key={index}
        className="d-flex align-items-center justify-content-between p-3"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "12px",                  // round tiles
          boxShadow: "0 2px 6px rgba(0,0,0,0.06)", // subtle shadow
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(0,0,0,0.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 2px 6px rgba(0,0,0,0.03)";
        }}
      >
        <div className="d-flex flex-column">
          <div style={{ fontWeight: "600", color: "#333" }}>
            {user.name}
          </div>
          <div style={{ fontSize: "0.85rem", color: "#555" }}>
            {user.email}
          </div>
        </div>

        <div className="d-flex gap-4" style={{ fontSize: "0.85rem", color: "#777" }}>
          <div>Logged In: {user.loggedIn}</div>
          <div>Logged Out: {user.loggedOut}</div>
        </div>

        <span
          style={{
            backgroundColor:
              user.role === "Admin"
                ? "rgba(33, 150, 243, 0.15)"
                : user.role === "Recruiter"
                ? "rgba(255, 193, 7, 0.2)"
                : "rgba(76, 175, 80, 0.15)",
            color:
              user.role === "Admin"
                ? "#1976d2"
                : user.role === "Recruiter"
                ? "#f57f17"
                : "#2e7d32",
            fontSize: "0.8rem",
            fontWeight: "600",
            padding: "6px 14px",
            borderRadius: "999px",
            display: "inline-block",
            textAlign: "center",
            minWidth: "80px",
          }}
        >
          {user.role}
        </span>
      </div>
    ))}
  </div>
</CCardBody>

</CCard>


    </>
  );
};

export default Dashboard;
