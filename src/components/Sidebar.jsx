import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Sidebar = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  // ─── Links per role ───────────────────────────────
  const getLinks = () => {
    switch (user?.role) {
      case 'student':
        return [
          { label: 'My Feed',    path: '/dashboard' },
          { label: 'Bookmarks',  path: '/bookmarks'  },
          { label: 'Profile',    path: '/profile'    },
        ]
      case 'faculty':
        return [
          { label: 'Dashboard',       path: '/dashboard'  },
          { label: 'My Posts',        path: '/my-posts'   },
          { label: 'Create Post',     path: '/create'     },
          { label: 'Profile',         path: '/profile'    },
        ]
      case 'hod':
        return [
          { label: 'Dashboard',       path: '/dashboard'  },
          { label: 'Dept Posts',      path: '/dept-posts' },
          { label: 'Create Post',     path: '/create'     },
          { label: 'Faculty List',    path: '/faculty'    },
          { label: 'Profile',         path: '/profile'    },
        ]
      case 'dean':
        return [
          { label: 'Dashboard',       path: '/dashboard'  },
          { label: 'Create Post',     path: '/create'     },
          { label: 'All Posts',       path: '/all-posts'  },
          { label: 'Profile',         path: '/profile'    },
        ]
      case 'cell':
        return [
          { label: 'Dashboard',       path: '/dashboard'  },
          { label: 'My Posts',        path: '/my-posts'   },
          { label: 'Create Post',     path: '/create'     },
          { label: 'Profile',         path: '/profile'    },
        ]
      case 'organization':
        return [
          { label: 'Dashboard',       path: '/dashboard'      },
          { label: 'My Events',       path: '/my-posts'       },
          { label: 'Create Event',    path: '/create'         },
          { label: 'Register Org',    path: '/org/register'   },
          { label: 'Profile',         path: '/profile'        },
        ]
      case 'admin':
        return [
          { label: 'Admin Panel',     path: '/admin'      },
          { label: 'All Users',       path: '/admin'      },
          { label: 'Departments',     path: '/admin'      },
          { label: 'Org Approvals',   path: '/admin'      },
          { label: 'All Posts',       path: '/admin'      },
        ]
      default:
        return []
    }
  }

  const links = getLinks()

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-200 py-6 px-4 flex flex-col gap-1">

      {/* User info at top */}
      <div className="mb-6 px-2">
        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{user?.department || 'College Wide'}</p>
      </div>

      {/* Nav links */}
      {links.map((link) => (
        <button
          key={link.label}
          onClick={() => navigate(link.path)}
          className="text-left text-sm px-3 py-2.5 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-700 font-medium transition"
        >
          {link.label}
        </button>
      ))}
    </aside>
  )
}

export default Sidebar