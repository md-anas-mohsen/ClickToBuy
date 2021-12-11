const Sequelize = require("sequelize");
const {
  product_categories: ProductCategory,
  categories: Category,
} = require("../models/getModels");
const Op = Sequelize.Op;

class APIQuery {
  constructor(tableModel, queryString, tableJoins, resultsPerPage) {
    this.tableModel = tableModel;
    this.queryString = queryString;
    this.tableJoins = tableJoins;
    this.resultsPerPage = resultsPerPage;
  }

  async query() {
    const keyword = this.queryString.keyword
      ? {
          name: Sequelize.where(Sequelize.fn("lower", Sequelize.col("name")), {
            [Op.like]: `%${this.queryString.keyword.toLowerCase()}%`,
          }),
        }
      : {};
    const priceRange =
      this.queryString.gte || this.queryString.lte
        ? {
            price: {
              [Op.gte]: Number(this.queryString.gte || 1),
              [Op.lte]: Number(this.queryString.lte || 99999999),
            },
          }
        : {};

    const ratings = this.queryString.ratings
      ? {
          ratings: {
            [Op.gte]: this.queryString.ratings,
          },
        }
      : {};

    const category = this.queryString.category
      ? {
          category_name: this.queryString.category,
        }
      : {};
    const page = this.queryString.page ? this.queryString.page : 1;

    this.queryResult = await this.tableModel.findAll({
      where: { ...keyword, ...priceRange, ...ratings },
      include: this.tableJoins,
    });
    console.log(this.queryResult);
    if (this.queryString.category) {
      this.queryResult = this.queryResult.filter((product) => {
        return product.product_categories.some((productCategory) => {
          console.log(
            `${
              productCategory.category?.category_name
            } === ${this.queryString.category?.toLowerCase()}`
          );
          return (
            productCategory.category?.category_name.toLowerCase() ===
            this.queryString.category?.toLowerCase()
          );
        });
      });
    }
    this.resultCount = this.queryResult.length;
    this.queryResult = this.queryResult.slice(
      this.resultsPerPage * (page - 1),
      this.resultsPerPage * page
    );
    return this;
  }
}

module.exports = APIQuery;
