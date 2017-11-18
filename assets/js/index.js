//
// // Set your secret key: remember to change this to your live secret key in production
// // See your keys here: https://dashboard.stripe.com/account/apikeys
// // var stripe = require("stripe")(process.env.test_stripe_public_key);
//
// // Token is created using Checkout or Elements!
// // Get the payment token ID submitted by the form:
// var token = request.body.stripeToken; // Using Express
//
// // Charge the user's card:
// stripe.charges.create({
//   amount: 1000,
//   currency: "cad",
//   description: "Example charge",
//   source: token,
// }, function(err, charge) {
//   // asynchronously called
// });