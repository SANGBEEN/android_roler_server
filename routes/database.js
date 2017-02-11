
 //  MODULE: database.js

 //  FUNCTIONS: database(mysql) function

 // COMMENTS:



/*----------------------------------------------------------------------------*
 *                                  INCLUDE                                   *
 *----------------------------------------------------------------------------*/

	var mysql = require('mysql');



/*----------------------------------------------------------------------------*
 *                              GLOBAL VARIABLES                              *
 *----------------------------------------------------------------------------*/

	var pool  = mysql.createPool({
					host 				: 'roler.cdqui1vgbssg.ap-northeast-2.rds.amazonaws.com',
					user 				: 'hyunsung',
					password 			: 'nanamare',
					database 			: 'Roler',
					debug				: false,	// FOR DEBUG
					connectionLimit 	: 100,
					waitForConnections 	: true
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
