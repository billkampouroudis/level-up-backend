import is from './is';

export const addPagination = (page, pageSize) => {
  const pagination = {};

  if (pageSize) {
    pagination.limit = parseInt(pageSize);
  }

  if (pagination.limit && page) {
    pagination.offset = (parseInt(page) - 1) * pagination.limit;
  }

  return pagination;
};

export const paginationValues = (page, pageSize, totalResults) => {
  page = page | 0;
  pageSize = pageSize | 0;
  totalResults = totalResults | 0;

  let totalPages = Math.ceil(totalResults / pageSize);

  if (
    !is.number(page) ||
    !is.number(pageSize) ||
    !is.number(totalResults) ||
    totalPages > totalResults ||
    page > totalPages
  ) {
    return {};
  }

  let nextPage = null;
  if (page * pageSize <= totalResults) {
    nextPage = page + 1;
  }

  let prevPage = null;
  if (page > 1) {
    prevPage = page - 1;
  }

  return {
    page,
    nextPage,
    prevPage,
    totalResults,
    totalPages
  };
};
