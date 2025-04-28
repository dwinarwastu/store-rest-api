const softDeletePlugins = function (schema, options = {}) {
  const deletedFieldName = options.deletedFieldName || "isDeleted";
  const deletedAtFieldName = options.deletedAtFieldName || "deletedAt";

  schema.add({
    [deletedFieldName]: { type: Boolean, default: false },
    [deletedAtFieldName]: { type: Date, default: null },
  });

  schema.methods.softDelete = function () {
    this[deletedFieldName] = true;
    this[deletedAtFieldName] = new Date();
    return this.save();
  };

  schema.methods.restore = function () {
    this[deletedFieldName] = false;
    this[deletedAtFieldName] = null;
    return this.save();
  };

  const excludeSoftDeleted = function (next) {
    const query = this.getQuery();
    if (query[deletedFieldName] == null) {
      this.where({
        [deletedFieldName]: { $ne: true },
      });
    }

    next();
  };

  schema.pre(["find", "findOne", "countDocuments"], excludeSoftDeleted);
};

export default softDeletePlugins;
