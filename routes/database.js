
 //  MODULE: database.js

 //  FUNCTIONS: database(mysql) function

 // COMMENTS:



/*----------------------------------------------------------------------------*
 *                                  INCLUDE                                   *
 *----------------------------------------------------------------------------*/

	var mysql = require('mysql');
	var db_config = require('../config/db-config.json');


/*----------------------------------------------------------------------------*
 *                              GLOBAL VARIABLES                              *
 *----------------------------------------------------------------------------*/

	var pool  = mysql.createPool({
					host 				: db_config.host,
					user 				: db_config.user,
					password 			: db_config.password,
					database 			: db_config.database,
					debug				: db_config.debug,	// FOR DEBUG
					connectionLimit 	: db_config.connectionLimit,
					waitForConnections 	: db_config.waitForConnections
				});


/*----------------------------------------------------------------------------*
 *
 *  Function: function query(sql, values, cb)
 *
 *  Purpose: SQL query
 *
 *  Accepts: SQL string
 *           parameters
 *           callback function
 *
 *  Returns: void
 *
 *  Comments:
 *
 *----------------------------------------------------------------------------*/

function query(sql, values, cb) {

	if (typeof values === 'function') {
		cb     = values;
		values = undefined;
	}

	if (typeof cb !== 'function') {
		cb = function() {};
	}

	pool.getConnection(function(err, conn) {

		if (err) {
			cb(err);
			return;
		}

		var q = conn.query(sql, values, function(err, res, fields) {

			if (err) {

				conn.release();

				console.error(err);

				cb(err);

				return;			// Exception Error: Connection already released
			}

			cb(err, res, fields);

			conn.release();
		});

		// FOR DEBUG
		console.log(q.sql);
	});
}


/*----------------------------------------------------------------------------*
 *                                   EXPORT                                   *
 *----------------------------------------------------------------------------*/

	exports.query		= query;
