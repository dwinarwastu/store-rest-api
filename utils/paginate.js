import pagination from "express-paginate";

export const paginate = async (options) => {
    try {
        const totalPage = Math.ceil(options.length / options.limit);
        let currentPage = parseInt(options.page) || 1;
        if (currentPage > totalPage) {
            currentPage = totalPage;
        }
        const nextPage = pagination.hasNextPages(options.req)(totalPage);
        const pages = pagination.getArrayPages(options.req)(
            3,
            totalPage,
            options.page
        );
        return {
            totalPage,
            currentPage,
            nextPage,
            pages,
        };
    } catch (error) {
        console.error(error);
        return;
    }
};
