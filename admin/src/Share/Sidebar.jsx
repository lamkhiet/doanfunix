import React, { useState } from "react";
import { Link } from "react-router-dom";

const MENU_ITEMS = [
  {
    title: "Users",
    icon: "fas fa-users",
    children: [
      { title: "User List", to: "/users", icon: "fas fa-list" },
      { title: "New User", to: "/users/new", icon: "fas fa-user-plus" },
    ],
  },
  {
    title: "Customers",
    icon: "fas fa-cubes",
    children: [
      { title: "Customer List", to: "/customers", icon: "fas fa-list" },
      {
        title: "New Customer",
        to: "/customers/new",
        icon: "fas fa-user-plus",
      },
    ],
  },
  {
    title: "Products",
    icon: "fas fa-cubes",
    children: [
      { title: "Product List", to: "/products", icon: "fas fa-list" },
      {
        title: "New Product",
        to: "/products/new",
        icon: "fas fa-user-plus",
      },
    ],
  },
  {
    title: "Categories",
    icon: "fas fa-cubes",
    children: [
      {
        title: "Category List",
        to: "/categories",
        icon: "fas fa-list",
      },
      {
        title: "New Category",
        to: "/categories/new",
        icon: "fas fa-user-plus",
      },
    ],
  },

  {
    title: "Order",
    icon: "fas fa-cubes",
    children: [
      {
        title: "Order List",
        to: "/orders",
        icon: "fas fa-list",
      },
    ],
  },
];

export default function Sidebar() {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleToggleMenu = (title) => {
    setActiveMenu(activeMenu === title ? null : title);
  };

  return (
    <aside
      className="bg-light border-end vh-100 p-3"
      style={{ width: "280px" }}
    >
      <div className="overflow-auto h-100">
        <nav className="navbar navbar-light align-items-start p-0">
          <ul className="navbar-nav flex-column w-100">
            {MENU_ITEMS.map((item, index) => {
              const hasChildren = !!item.children;
              const isOpen = activeMenu === item.title;

              return (
                <li key={index} className="nav-item mb-1">
                  {hasChildren ? (
                    <button
                      className={`nav-link w-100 border-0 bg-transparent text-start d-flex align-items-center justify-content-between p-2 rounded ${
                        isOpen ? "bg-secondary bg-opacity-10 active" : ""
                      }`}
                      onClick={() => handleToggleMenu(item.title)}
                      aria-expanded={isOpen}
                    >
                      <div className="d-flex align-items-center">
                        <i className={`${item.icon} me-2 fs-5`}></i>
                        <span>{item.title}</span>
                      </div>
                      <i
                        className={`fas fa-chevron-down small transition-icon ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        style={{
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                        }}
                      ></i>
                    </button>
                  ) : (
                    <Link
                      className="nav-link d-flex align-items-center p-2 rounded"
                      to={item.to}
                    >
                      <i className={`${item.icon} me-2 fs-5`}></i>
                      <span>{item.title}</span>
                    </Link>
                  )}

                  {hasChildren && (
                    <ul
                      className={`nav flex-column ps-4 list-unstyled collapse ${
                        isOpen ? "show" : ""
                      }`}
                    >
                      {item.children.map((subItem, subIndex) => (
                        <li key={subIndex} className="nav-item mt-1">
                          <Link
                            to={subItem.to}
                            className="nav-link d-flex align-items-center p-2 rounded small text-muted"
                          >
                            <i className={`${subItem.icon} me-2`}></i>
                            <span>{subItem.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
