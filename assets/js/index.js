if (window.netlifyIdentity) {
  window.netlifyIdentity.on("init", user => {
    netlifyIdentity.on('logout', function() {
      console.log('login outtt')
      document.location.href = '/';
    })
  });
}