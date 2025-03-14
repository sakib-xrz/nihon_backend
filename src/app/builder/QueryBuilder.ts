import { FilterQuery, Query } from 'mongoose';

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map(
          (field) =>
            ({
              [field]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      });
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };

    // Filtering
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // Handle brand filtering
    if (queryObj.brand) {
      this.modelQuery = this.modelQuery.find({
        brand: queryObj.brand as string,
      });
      delete queryObj.brand;
    }

    // Handle category filtering
    if (queryObj.category) {
      this.modelQuery = this.modelQuery.find({
        category: queryObj.category as string,
      });
      delete queryObj.category;
    }

    // Handle price range filtering
    const minPrice =
      queryObj.minPrice != null ? Number(queryObj.minPrice) : undefined;
    const maxPrice =
      queryObj.maxPrice != null ? Number(queryObj.maxPrice) : undefined;

    if (minPrice != null || maxPrice != null) {
      if (minPrice != null && maxPrice != null) {
        this.modelQuery = this.modelQuery.find({
          price: { $gte: minPrice, $lte: maxPrice },
        });
      } else if (minPrice != null) {
        this.modelQuery = this.modelQuery.find({
          price: { $gte: minPrice },
        });
      } else if (maxPrice != null) {
        this.modelQuery = this.modelQuery.find({
          price: { $lte: maxPrice },
        });
      }
      delete queryObj.minPrice;
      delete queryObj.maxPrice;
    }

    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>);

    return this;
  }

  sort() {
    const sortField = this?.query?.sort as string;

    let sortQuery = '-createdAt'; // default sorting
    if (sortField) {
      const sortFields = sortField.split(',');

      sortQuery = sortFields
        .map((field) => {
          if (field === 'priceAsc') {
            return 'price';
          } else if (field === 'priceDesc') {
            return '-price';
          } else {
            return field;
          }
        })
        .join(' ');
    }

    this.modelQuery = this.modelQuery.sort(sortQuery as string);

    return this;
  }

  paginate() {
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const fields =
      (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v';

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
