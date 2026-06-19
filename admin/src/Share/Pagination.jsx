import React from "react";
import PropTypes from "prop-types";
import IndexPage from "./IndexPage";

Pagination.propTypes = {
  pagination: PropTypes.object,
  handlerChangePage: PropTypes.func,
  totalPage: PropTypes.number,
  totalDocs: PropTypes.number,
};

Pagination.defaultProps = {
  pagination: {},
  handlerChangePage: null,
  totalPage: null,
};

function Pagination(props) {
  const { pagination, handlerChangePage, totalPage, totalDocs } = props;
  const { page, count } = pagination;

  const indexPage = [];

  for (var i = 1; i <= totalPage; i++) {
    indexPage.push(i);
  }

  const onDownPage = (value) => {
    if (!handlerChangePage) {
      return;
    }

    const newPage = parseInt(value) - 1;
    handlerChangePage(newPage);
  };

  const onUpPage = (value) => {
    if (!handlerChangePage) {
      return;
    }

    const newPage = parseInt(value) + 1;
    handlerChangePage(newPage);
  };

  const currentPage = parseInt(page);
  const currentCount = parseInt(count);
  const fromProduct = (currentPage - 1) * currentCount + 1;
  const toProduct = Math.min(currentPage * currentCount, totalDocs);

  return (
    <nav aria-label="Page navigation example" className="pt-5">
      <ul className="pagination justify-content-center justify-content-lg-end">
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => onDownPage(page)}
            disabled={currentPage <= 1}
          >
            <span>«</span>
          </button>
        </li>
        <IndexPage
          indexPage={indexPage}
          handlerChangePage={handlerChangePage}
          pagination={pagination}
        />
        <li className="page-item">
          <button
            className="page-link"
            onClick={() => onUpPage(page)}
            disabled={currentPage >= totalPage}
          >
            <span>»</span>
          </button>
        </li>
      </ul>
      <div className="pagination justify-content-center justify-content-lg-end">
        <p className="text-small text-muted mb-0">
          {totalDocs > 0
            ? `Showing ${fromProduct}–${toProduct} of ${totalDocs} results`
            : "No results found"}
        </p>
      </div>
    </nav>
  );
}

export default Pagination;
