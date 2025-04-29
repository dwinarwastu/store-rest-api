import { hasNextPages } from "express-paginate";

const paginationPlugin = (schema) => {
  schema.statics.paginate = async function (filter = {}, options = {}) {
    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.max(1, parseInt(options.limit, 10) || 10);
    const sort = options.sort || "-createdAt";
    const populate = options.populate;
    const skip = (page - 1) * limit;

    let query = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (populate) {
      const populateArray = Array.isArray(populate) ? populate : [populate];
      populateArray.forEach((populateField) => {
        query = query.populate(populateField);
      });
    }

    const results = await query;
    const totalResults = await this.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limit);

    return {
      results,
      page,
      limit,
      totalPages,
      totalResults,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  };
};

export default paginationPlugin;
