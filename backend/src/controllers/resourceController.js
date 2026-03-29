const LabourUsage = require("../models/LabourUsage");
const MaterialUsage = require("../models/MaterialUsage");
const Bill = require("../models/Bill");


// Add labour usage
exports.addLabourUsage = async (req, res) => {

  try {

    const { projectId, stageId, supervisorId, numberOfWorkers, workingHours } = req.body;

    const labour = new LabourUsage({
      projectId,
      stageId,
      supervisorId,
      numberOfWorkers,
      workingHours
    });

    await labour.save();

    res.status(201).json({
      message: "Labour usage recorded",
      labour
    });

  } catch (error) {

    console.log("LABOUR USAGE ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};




// Get labour usage for project
exports.getProjectLabour = async (req, res) => {

  try {

    const { projectId } = req.params;

    const labour = await LabourUsage.find({ projectId })
      .populate("stageId", "name")
      .populate("supervisorId", "name");

    res.json(labour);

  } catch (error) {

    console.log("GET LABOUR ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

// Add material usage
exports.addMaterialUsage = async (req, res) => {

  try {

    const { projectId, stageId, supervisorId, materialName, quantity, unit } = req.body;

    const material = new MaterialUsage({
      projectId,
      stageId,
      supervisorId,
      materialName,
      quantity,
      unit
    });

    await material.save();

    res.status(201).json({
      message: "Material usage recorded",
      material
    });

  } catch (error) {

    console.log("MATERIAL USAGE ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// Get materials used in a project
exports.getProjectMaterials = async (req, res) => {

  try {

    const { projectId } = req.params;

    const materials = await MaterialUsage.find({ projectId })
      .populate("stageId", "name")
      .populate("supervisorId", "name");

    res.json(materials);

  } catch (error) {

    console.log("GET MATERIAL ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};

// Add new bill / purchase
exports.addBill = async (req, res) => {

  try {

    const { projectId, supervisorId, itemName, category, amount, supplier, description } = req.body;

    const bill = new Bill({
      projectId,
      supervisorId,
      itemName,
      category,
      amount,
      supplier,
      description
    });

    await bill.save();

    res.status(201).json({
      message: "Bill recorded successfully",
      bill
    });

  } catch (error) {

    console.log("ADD BILL ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};



// Get all bills of a project
exports.getProjectBills = async (req, res) => {

  try {

    const { projectId } = req.params;

    const bills = await Bill.find({ projectId })
      .populate("supervisorId", "name")
      .sort({ createdAt: -1 });

    res.json(bills);

  } catch (error) {

    console.log("GET BILLS ERROR:", error);

    res.status(500).json({
      message: "Server error"
    });

  }

};