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

// var requestURL = '/articles.json';
// var request = new XMLHttpRequest();
// request.open('GET', requestURL);
//
// request.responseType = 'json';
// request.send();
// request.onload = function() {
//   const articles = request.response;
//   // console.log(articles);
//   // showArticles(articles);
//   getAuthorsArticles(articles, "129390")
// }
//
// function showArticles(postIds) {
//   // console.log(postIds)
//   var posts = postIds;
//   for (var i = 0; i < posts.length; i++) {
//     console.log(posts[i].title)
//   }
// }
//
// function getAuthorsArticles(jsonObj, author) {
//   var posts = jsonObj;
//
//   for (var i = 0; i < posts.length; i++) {
//     var authors = posts[i].authors
//     var authorIds = new Array;
//     var authorPosts = new Array;
//
//     authors.forEach(function(names) {
//       authorIds.push(names.id)
//     });
//
//     if(authorIds.includes(author)) {
//       authorPosts.push(posts[i])
//     }
//
//     showArticles(authorPosts);
//
//   }
// }
