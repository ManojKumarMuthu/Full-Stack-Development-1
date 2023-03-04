// const Data = require('../../shared/resources/data');

// const contactUs = (req, res) => {
//   const firstName = req.body.first_name;
//   const lastName = req.body.last_name;
//   const message = req.body.message;

//   const responseMessage = `Message received from ${firstName} ${lastName}`;

//   console.log(responseMessage);
//   res.send(responseMessage);
// };

// const calculateQuote = (req, res) => {
//   // define constants
//   const apts = +req.query.apts;
//   const floors = +req.query.floors;
//   const tier = req.query.tier;
//   const maxOcc = +req.query.maxOcc; 
//   const elevator = +req.query.elevator; 
//   const building = req.query.building;

//   // validate request object

//   if (!Object.keys(Data.unitPrices).includes(tier)) {
//     res.status(400).send(`Error: invalid tier`);
//     return;
//   }

//   function checkBuildingType(building) {
//     const validTypes = ["residential", "commercial", "industrial"];
//     if (!validTypes.includes(building)) {
//       return { error: "Invalid building type" };
//     }
//     return { success: "Building type is valid" };
//   }

//   let buildingTypeValidation;

//   if (building === "residential") {
//     buildingTypeValidation = buildingTypeResidential(); 
//   } else if (building === "commercial") {
//     buildingTypeValidation = buildingTypeCommercial(); 
//   } else if (building === "industrial") {
//     buildingTypeValidation = buildingTypeIndustrial(); 
//   } else {
//     res.status(400).send(`Error: invalid building type`);
//     return;
//   }

//   function buildingTypeResidential() { // removed argument since it was not used
//     if (isNaN(floors) || isNaN(apts)) {
//       res.status(400).send(`Error: apts and floors must be specified as numbers`);
//       return;
//     }

//     if (!Number.isInteger(floors) || !Number.isInteger(apts)) {
//       res.status(400).send(`Error: apts and floors must be integers`);
//       return;
//     }

//     if (floors < 1 || apts < 1) {
//       res.status(400).send(`Error: apts and floors must be greater than zero`);
//       return;
//     }
//   }

//   function buildingTypeCommercial() { // removed argument since it was not used
//     if (isNaN(floors) || isNaN(maxOcc)) {
//       res.status(400).send(`Error: maxOcc and floors must be specified as numbers`);
//       return;
//     }

//     if (!Number.isInteger(floors) || !Number.isInteger(maxOcc)) {
//       res.status(400).send(`Error: maxOcc and floors must be integers`);
//       return;
//     }

//     if (floors < 1 || maxOcc < 1) {
//       res.status(400).send(`Error: maxOcc and floors must be greater than zero`);
//       return;
//     }
//   }

//   function buildingTypeIndustrial() { // removed argument since it was not used
//     if (isNaN(elevator)) {
//       res.status(400).send(`Error: elevator must be specified as a number`);
//       return;
//     }

//     if (!Number.isInteger(elevator)) {
//       res.status(400).send(`Error: elevator must be an integer`);
//       return;
//     }
//     if (elevator < 1 ) {
//       res.status(400).send(`Error: apts and floors must be greater than zero`);
//       return;
//     }
//   }



//   // business logic
//   let numElevators;

//   if (building === "residential") {
//     numElevators = calcResidentialElev(floors, apts);
//   } else if (building === "commercial") {
//     numElevators = calcCommercialElev(floors, maxOcc);
//   } else if (building === "industrial") {
//     numElevators = calcIndustrialElev(elevator);
//   }

//   const totalInstallationFee = calcInstallFee(numElevators, tier);
//   const totalElevatorCost = calcElevatorCost(numElevators, tier);
//   const totalCost = calcTotalCost(numElevators, tier);

//   // format response
//   res.send({
//     elevators_required: numElevators,
//     cost: totalElevatorCost,
//     unit_price: Data.unitPrices[tier],
//     installation_fees: totalInstallationFee,
//     total_cost: totalCost
//   });
// };

// const calcResidentialElev = (numFloors, numApts) => {
//   const elevatorsRequired = Math.ceil(numApts / numFloors / 6) * Math.ceil(numFloors / 20);
//   return elevatorsRequired;
// };

// const calcCommercialElev = (numFloors, maxOcc) => {
//   const elevatorsRequired = Math.ceil((maxOcc * numFloors) / 1000) * Math.ceil(numFloors / 20);
//   const freightElevatorsRequired = Math.ceil(numFloors / 20);
//   return elevatorsRequired + freightElevatorsRequired;
// };

// const calcIndustrialElev = (elevator) => {
//   return elevator;
// };

// const calcElevatorCost = (numElevators, tier) => {
//   const unitPrice = Data.unitPrices[tier];
//   const elevatorCost = numElevators * unitPrice;
//   return elevatorCost;
// };

// const calcInstallFee = (numElevators, tier) => {
//   const unitPrice = Data.unitPrices[tier];
//   const installPercentFee = Data.installPercentFees[tier];
//   const installationFees = numElevators * unitPrice * (installPercentFee / 100);
//   return installationFees;
// };

// const calcTotalCost = (numElvs, tier) => {
//   const unitPrice = Data.unitPrices[tier];
//   const installPercentFee = Data.installPercentFees[tier];
//   const totalInstallationFee = numElvs * unitPrice * (installPercentFee / 100);
//   const totalElevatorCost = numElvs * unitPrice;
//   const totalCost = totalInstallationFee + totalElevatorCost;
//   return totalCost;
// };


// module.exports = {contactUs, calculateQuote };























const asyncWrapper = require('../../shared/util/base-utils')
// const Contact = require('../../shared/db/mongodb/schemas/public.Schema')
const Data = require('../../shared/resources/data');


const contactUs = asyncWrapper( async(req, res) => {
  const contact = await Contact.create(req.body);
  res.status(201).json({ msg: 'Contact created', data: contact });
});


const calculateQuote = asyncWrapper( async(req,res) => {
  // define constants
  let isValid = true;
  let numElevators = req.query.elevators;
  let costs;
  const apts = req.query.apts;
  const floors = req.query.floors;
  const occupancy = req.query.occupancy;
  const building = req.params.building;
  const tier = req.query.tier;
  if(!isValid){
    res.status(400);
    res.send('Invalid building type.')
    return;
  }
  if(building == 'residential'){
    if(numElevators === undefined){
      numElevators = calcResidentialElev(floors,apts);
      res.send({elevators_required: numElevators});
    }
    else{
      costs = calcInstallFee(numElevators,tier.toLowerCase());
      res.send(costs);
    }
  }
  else if(building == 'commercial'){
    if(numElevators === undefined){
      numElevators = calcCommercialElev(floors, occupancy);
      res.send({elevators_required: numElevators});
    }
    else{
      costs = calcInstallFee(numElevators,tier.toLowerCase());
      res.send(costs);
    }
  }
  else if(building == 'industrial'){
    costs = calcInstallFee(numElevators,tier.toLowerCase());
    res.send(costs);
  }
});
const calcResidentialElev = (numFloors, numApts) => {
  const elevatorsRequired = Math.ceil(numApts / numFloors / 6)*Math.ceil(numFloors / 20);
  return elevatorsRequired;
};
const calcCommercialElev = (numFloors, maxOccupancy) => {
  const elevatorsRequired = Math.ceil((maxOccupancy * numFloors) / 200)*Math.ceil(numFloors / 10);
  const freighElevatorsRequired = Math.ceil(numFloors / 10);
  return freighElevatorsRequired + elevatorsRequired;
};
const calcInstallFee = (numElvs, tier) => {
  const unitPrice = Data.unitPrices[tier];
  const installPercentFees = Data.installPercentFees[tier];
  const subTotal = numElvs * unitPrice;
  const fees = (installPercentFees/100) * subTotal;
  const total = subTotal + fees;
  return {cost: total, unit_price: unitPrice, fees: fees, subtotal: subTotal};
};
module.exports = {contactUs ,calculateQuote};

