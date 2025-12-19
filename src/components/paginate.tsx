import React from "react";
import ReactPaginate from "react-paginate";
import "../styles/styles.css";

interface PaginationProps {
    pageCount: number;
    onPageChange: (selected: { selected: number }) => void;
}

const Pagination: React.FC<PaginationProps> = ({pageCount, onPageChange,}) => {
    if (pageCount <= 1) return null;

    return (
        <ReactPaginate
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"

            previousClassName="previous page-item"
            previousLinkClassName="page-link"

            nextClassName="next page-item"
            nextLinkClassName="page-link"

            breakClassName="break page-item"
            breakLinkClassName="page-link"

            activeClassName="active"
            disabledClassName="disabled"

            previousLabel="<"
            nextLabel=">"
            breakLabel="..."

            onPageChange={onPageChange}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
        />
    );
};

export default Pagination;