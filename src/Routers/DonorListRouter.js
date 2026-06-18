const express = require("express");
const { UserAuth } = require("../utils/validations");
const List = require("../models/List");
const NewDataSet = require("../models/NewDataSet")

const Router = express.Router();

Router.get("/getList", UserAuth, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const search = req.query.search || "";
    const sortField = req.query.sortField || "name";
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;

    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } }
      ];
    }

    const skip = (page - 1) * limit;

    const totalRecords = await NewDataSet.countDocuments(filter);

    const data = await NewDataSet.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      data,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / limit),
      totalRecords,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
});

const searchDonorByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;

    let donor = await NewDataSet.findOne({ mobile });

    if (donor) {
      return res.json({
        source: "new",
        data: donor,
      });
    }

    donor = await List.findOne({ mobile });

    if (donor) {
      return res.json({
        source: "old",
        data: donor,
      });
    }

    return res.status(404).json({
      message: "Donor not found",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const submitDonor = async (req, res) => {
  try {
    const { mobile, source,name } = req.body;

    if (source === "old") {
      const newDonor = await NewDataSet.create({
        ...req.body,
        source: "new",
        migratedFromOld: true,
      });

      return res.json({
        message: "Migrated from OLD to NEW dataset",
        data: newDonor,
      });
    }

    const existing = await NewDataSet.findOne({ mobile,name });

    if (existing) {
      const updated = await NewDataSet.findByIdAndUpdate(
        existing._id,
        req.body,
        { new: true }
      );

      return res.json({
        message: "Updated existing record in NEW dataset",
        data: updated,
      });
    }

    const newDonor = await NewDataSet.create({
      ...req.body,
      source: "new",
      migratedFromOld: false,
    });

    return res.json({
      message: "New donor added",
      data: newDonor,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



Router.get("/donor/mobile/:mobile",UserAuth, searchDonorByMobile);
Router.post("/donor/submit",UserAuth, submitDonor);



module.exports = Router;
