import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilGrid,
  cilPeople,
  cilUser,
  cilBriefcase,
  cilFolderOpen,
  cilChart,
  cilSettings,
  cilCloud,
  cilLockLocked,
  cilExitToApp,
  cilClipboard,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  // --- Main Section Heading ---
  {
    component: CNavTitle,
    name: 'Main',
  },
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilGrid} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Recruiters',
    to: '/recruiters',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Candidates',
    to: '/candidates',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Jobs / Open Roles',
    to: '/jobs',
    icon: <CIcon icon={cilBriefcase} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Talent Pool',
    to: '/talent-pool',
    icon: <CIcon icon={cilFolderOpen} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Activity Log',
    to: '/activity-log',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />,
  },

  // --- System Section Heading ---
  {
    component: CNavTitle,
    name: 'Stats Overview',
  },
  {
    component: CNavItem,
    name: 'Stats Overview',
    to: '/stats-overview',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Settings',
    to: '/settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },

  // --- Auth Section ---
  {
    component: CNavTitle,
    name: 'Authentication',
  },
  {
    component: CNavGroup,
    name: 'Account',
    icon: <CIcon icon={cilLockLocked} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Login',
        to: '/login',
      },
      {
        component: CNavItem,
        name: 'Logout',
        to: '/logout',
        icon: <CIcon icon={cilExitToApp} customClassName="nav-icon" />,
      },
    ],
  },
]

export default _nav
