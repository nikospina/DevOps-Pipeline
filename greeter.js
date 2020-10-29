(function (exports) {
  function greet(name) {
    const options = {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    };
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', options);
    return `Hello, ${name}! Today is ${formattedDate}.`;
  }

  exports.greet = greet;
}(this));
