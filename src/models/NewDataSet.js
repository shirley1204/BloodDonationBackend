const mongoose = require("mongoose");

const newDataSetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    gender: {
      type: String,
    },
    dob: {
      type: Date,
    },
    mobile: {
      type: Number,
    },
    address: {
      type: String,
    },
    bloodGrp: {
      type: String,
    },
    age: {
      type: Number,
    },
    count: {
      type: Number,
    },
    created_by: {
      type: String,
    },
    source: {
      type: String,
      enum: ["old", "new"],
      default: "new",
    },

    migratedFromOld: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const newDataSet = mongoose.model("newDataSet", newDataSetSchema);

module.exports = newDataSet;
