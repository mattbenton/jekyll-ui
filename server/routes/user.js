
/*
 * GET users listing.
 */

exports.list = function(req, res){
  // res.send("respond with a resource");
  res.json([
    { name: 'Matt' },
    { name: 'Decca' },
  ]);
};