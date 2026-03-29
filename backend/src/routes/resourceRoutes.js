const express = require("express");
const router = express.Router();

const resourceController = require("../controllers/resourceController");


// Add labour usage
router.post("/labour", resourceController.addLabourUsage);
router.get("/labour/:projectId", resourceController.getProjectLabour);


// Material routes
router.post("/material", resourceController.addMaterialUsage);
router.get("/material/:projectId", resourceController.getProjectMaterials);


// Bills
router.post("/bill", resourceController.addBill);
router.get("/bill/:projectId", resourceController.getProjectBills);


module.exports = router;