const router = require("express").Router();

// version 1 api
router.use("/v1", require("./v1"));

module.exports = router;
