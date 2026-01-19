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
            activeClassName="active"
            disabledClassName="disabled"

            previousLabel="<"
            nextLabel=">"
            breakLabel="..."

            onPageChange={onPageChange}
            pageRangeDisplayed={1}
            marginPagesDisplayed={1}
            pageCount={pageCount}
            renderOnZeroPageCount={null}
        />
    );
};

export default Pagination;