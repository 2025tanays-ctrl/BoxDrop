require("dotenv").config();
const mongoose = require("mongoose");
const Plan = require("./models/Plan");
const plans = [
{name:"Skincare Starter Box",description:"Monthly skincare essentials for a simple daily routine.",category:"skincare",price:999,billingCycle:"monthly",products:["Face Wash","Moisturizer","Sunscreen","Face Serum"]},
{name:"Fitness Essentials Box",description:"Useful fitness products delivered every month.",category:"fitness",price:799,billingCycle:"monthly",products:["Protein Bar","Resistance Band","Shaker Bottle","Workout Towel"]},
{name:"Coffee Lovers Box",description:"A monthly selection for people who love coffee.",category:"coffee",price:699,billingCycle:"monthly",products:["Premium Coffee","Cold Brew","Coffee Beans","Coffee Mug"]},
{name:"Self Care Box",description:"Relaxing and useful self-care products delivered monthly.",category:"self-care",price:899,billingCycle:"monthly",products:["Body Wash","Candle","Face Mask","Hand Cream"]}
];
(async()=>{try{await mongoose.connect(process.env.MONGO_URI);await Plan.deleteMany({});await Plan.insertMany(plans);console.log("Plans added successfully");await mongoose.connection.close()}catch(e){console.error(e.message);process.exit(1)}})();
