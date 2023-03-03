const Data = require('../../shared/resources/data');

const contactUs = (req,res) => {
  const firstName = req.body.first_name;
  const lastName = req.body.last_name;
  const message = req.body.message;

  const responseMessage = `Message received from ${firstName} ${lastName}`;

  console.log(responseMessage);
  res.send(responseMessage);
};



const calculateQuote = (req, res) => {
  // define constants
  const apts = +req.query.apts;
  const floors = +req.query.floors;
  const tier = req.query.tier.toLowerCase();
  const maxOcc = req.query.maxOcc;
  const elevator = req.query.elevator;
  const building = req.query.building.toLowerCase();

  // validate request object
  if (!Object.keys(Data.unitPrices).includes(tier)) {
    res.status(400).send(`Error: invalid tier`);
    return;
  }

  if (isNaN(floors) || isNaN(apts)) {
    res.status(400).send(`Error: apts and floors must be specified as numbers`);
    return;
  }

  if (!Number.isInteger(floors) || !Number.isInteger(apts)) {
    res.status(400).send(`Error: apts and floors must be integers`);
    return;
  }

  if (floors < 1 || apts < 1) {
    res.status(400).send(`Error: apts and floors must be greater than zero`);
    return;
  }

  // business logic
  let numElevators;

  if (building === "residential") {
    numElevators = calcResidentialElev(floors, apts);
  } else if (building === "commercial") {
    numElevators = calcCommercialElev(floors, maxOcc);
  } else if (building === "industrial") {
    numElevators = calcIndustrialElev(elevator);
  }

  const totalInstallationFee = calcInstallFee(numElevators, tier);
  const totalElevatorCost = calcElevatorCost(numElevators, tier);
  const totalCost = calcTotalCost(numElevators, tier);

  // format response
  res.send({
    elevators_required: numElevators,
    cost: totalElevatorCost,
    unit_price: Data.unitPrices[tier],
    installation_fees: totalInstallationFee,
    total_cost: totalCost
  });
};

const calcResidentialElev = (numFloors, numApts) => {
  const elevatorsRequired = Math.ceil(numApts / numFloors / 6) * Math.ceil(numFloors / 20);
  return elevatorsRequired;
};

const calcCommercialElev = (numFloors, maxOcc) => {
  const elevatorsRequired = Math.ceil((maxOcc * numFloors) / 1000) * Math.ceil(numFloors / 20);
  const freightElevatorsRequired = Math.ceil(numFloors / 20);
  return elevatorsRequired + freightElevatorsRequired;
};

const calcIndustrialElev = (elevator) => {
  return elevator;
};

const calcElevatorCost = (numElevators, tier) => {
  const unitPrice = Data.unitPrices[tier];
  const elevatorCost = numElevators * unitPrice;
  return elevatorCost;
};

const calcInstallFee = (numElevators, tier) => {
  const unitPrice = Data.unitPrices[tier];
  const installPercentFee = Data.installPercentFees[tier];
  const installationFees = numElevators * unitPrice * (installPercentFee / 100);
  return installationFees;
};

const calcTotalCost = (numElvs, tier) => {
  const unitPrice = Data.unitPrices[tier];
  const installPercentFee = Data.installPercentFees[tier];
  const totalInstallationFee = numElvs * unitPrice * (installPercentFee / 100);
  const totalElevatorCost = numElvs * unitPrice;
  const totalCost = totalInstallationFee + totalElevatorCost;
  return totalCost;
};


module.exports = {contactUs, calculateQuote };
