'use strict';

if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", function (user) {
    netlifyIdentity.on('logout', function () {
      console.log('login outtt');
      document.location.href = '/';
    });
  });
}