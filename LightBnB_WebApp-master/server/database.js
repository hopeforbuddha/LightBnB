const properties = require('./json/properties.json');
const users = require('./json/users.json');
const {Pool, Client} = require('pg')
/// Users
const pool = new Pool({
  user: 'vagrant',
  host: 'localhost',
  database: 'lightbnb',
  password: '123',
  port: 5432
})
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1`, [email])
    .then((result) => {
      return result.rows[0];
    })
    .catch((err) => {
      console.log(err.message);
    });
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool.query(`SELECT * FROM users WHERE id = $1`, [id])
  .then((resault) => {
    return resault.rows[0];
  })
  .catch((err) => {err.message});
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
  .query(`insert into users(name, email, password) values ($1, $2, $3) returning *;`, [user.name, user.email, user.password])
  .then((result) => {
    return result.rows[0]
  })
  .catch((err) => {
    console.log(err.message);
  });
}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool.query(`select * from reservations join properties on property_id = properties.id where guest_id = $1 limit $2;`, [guest_id, limit])
  .then((result) => {return result.rows})
  .catch((err) => {
    console.log(err.message);
  });
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
 const getAllProperties = (options, limit = 10) => {
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;
  let queryParams = [];
  let where = 0;
  

    if (options.owner_id) {
    queryParams.push(`${options.owner_id}`)
    where = 1;
    queryString += `WHERE properties.owner_id = $${queryParams.length}`;
  }
  
  if (options.minimum_price_per_night && options.maximum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`)
    queryParams.push(`${options.maximum_price_per_night}`)
    if (options.owner_id) {
    queryString += ` AND properties.cost_per_night >= $${queryParams.length - 1} AND properties.cost_per_night <= $${queryParams.length}`;
    } else {
      where = 1;
      queryString += `WHERE properties.cost_per_night >= $${queryParams.length - 1} AND properties.cost_per_night <= $${queryParams.length}`;

    }
  } 

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night}`)
    if (where === 0) {
      where = 1;
      queryString += `WHERE properties.cost_per_night >= $${queryParams.length}`;
    } else {
      queryString += ` AND properties.cost_per_night >= $${queryParams.length}`;

    }
  }

  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night}`)
    if (where === 0) {
      where = 1;
      queryString += `WHERE properties.cost_per_night <= $${queryParams.length}`;
    } else {
      queryString += ` AND properties.cost_per_night <= $${queryParams.length}`;

    }
  }

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`)
    if (where === 0) {
      where = 1;
      queryString += `WHERE property_reviews.rating >= $${queryParams.length}`
    } else {
      queryString += ` AND property_reviews.rating >= $${queryParams.length}`
    }
  }



  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const query = pool
  .query(`INSERT INTO properties (owner_id,
    title,
    description,
    thumbnail_photo_url,
    cover_photo_url,
    cost_per_night,
    street,
    city,
    province,
    post_code,
    country,
    parking_spaces,
    number_of_bathrooms,
    number_of_bedrooms,
    active) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
    $12, $13, $14, true) RETURNING *;`, [property.owner_id, property.title, property.description, property.thumbnail_photo_url,
    property.cover_photo_url, property.cost_per_night, property.street, property.city,
  property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms])
  .then((result) => {
    console.log(result.rows)
    return result.rows
  })
  
  return query;
}
exports.addProperty = addProperty;
