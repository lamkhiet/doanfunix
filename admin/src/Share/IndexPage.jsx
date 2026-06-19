import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

IndexPage.propTypes = {
  indexPage: PropTypes.array,
  handlerChangePage: PropTypes.func,
  pagination: PropTypes.object,
};

IndexPage.defaultProps = {
  indexPage: null,
  handlerChangePage: null,
  pagination: {},
};

function IndexPage(props) {
  const { indexPage, handlerChangePage, pagination } = props;

  const { page } = pagination;

  const onIndexPage = (value) => {
    if (!handlerChangePage) {
      return;
    }

    handlerChangePage(value);
  };

  console.log(indexPage);

  return (
    <div className="d-flex">
      {indexPage &&
        indexPage.map((value) => (
          <li
            className={
              value === parseInt(page) ? "page-item active" : "page-item"
            }
            key={value}
            onClick={() => onIndexPage(value)}
          >
            <Link className="page-link">{value}</Link>
          </li>
        ))}
    </div>
  );
}

export default IndexPage;
