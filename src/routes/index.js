const express = require("express");
const router = express.Router();
const {registerOwnerAndVehicle, retrieveInfo} = require('../utils/logic');

function registerVehicle(req, res) {
  const {owner_info, vehicle_info} = req.body;
  const encryptedSecretKey = registerOwnerAndVehicle(owner_info, vehicle_info);
  res.json({encryptedSecretKey});
}

function retrieveVehicleInfo(req, res) {
  const {requestId, decryptedString} = req.body;
  const vehicleInfo = retrieveInfo(requestId, decryptedString);
  res.json(vehicleInfo);
}

let routes = (app) => {
  router.post("/register", registerVehicle);
  router.post("/retrieve", retrieveVehicleInfo);
  app.use(router);
};

module.exports = routes;
