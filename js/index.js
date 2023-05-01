// Update the battery charge slider
function updateBatteryCharge(percentage) {
  $("#battery").val(percentage);
  updateBackgroundColor();
}

// Update the plugged in flipswitch
function updatePluggedIn(pluggedIn) {
  $("#plugged").val(pluggedIn);
  updateBackgroundColor();
}

// Update the background color based on battery charge and plugged in status
function updateBackgroundColor() {
  var charge = $("#battery").val();
  var pluggedIn = $("#plugged").val();

  if (charge < 20 && pluggedIn === "off") {
    console.log("in");
    // Below 20% and not plugged in

    $("body").removeClass("status-red").addClass("status-orange");
  } else if (charge < 20 && pluggedIn === "on") {
    // Below 20% and plugged in
    $("body").removeClass("status-orange").addClass("status-red");
  } else {
    // Above 20% or plugged in
    $("body").removeClass("status-orange status-red");
  }
}

function updateDeviceInfo() {
  var deviceInfo = [
    "Cordova version: " + device.cordova,
    "Device model: " + device.model,
    "Device platform: " + device.platform,
    "Device UUID: " + device,
    "Device version: " + device.version,
    "Device manufacturer: " + device.manufacturer,
    "Device is virtual: " + device.isVirtual,
    "Device serial number: " + device.serial,
  ];
  var deviceInfoList = $("#device-info");

  // Remove any existing device information
  deviceInfoList.empty();

  // Add each item of device information as a list item
  for (var i = 0; i < deviceInfo.length; i++) {
    var item = $("<li>" + deviceInfo[i] + "</li>");
    deviceInfoList.append(item);
  }
}
// Update the battery charge and plugged in status when the page is shown
$("#status").on("pageshow", function () {
  updateBatteryCharge(Math.floor(Math.random() * 101)); // Simulate random battery charge percentage
  updatePluggedIn(Math.random() >= 0.5 ? "on" : "off"); // Simulate random plugged in status
  updateDeviceInfo();
});

// Update the battery charge and plugged in status when the slider or flipswitch changes
$("#battery").on("change", function () {
  updateBackgroundColor();
});

$("#plugged").on("change", function () {
  updateBackgroundColor();
});

// Wait for Cordova to be fully loaded
document.addEventListener("deviceready", onDeviceReady, false);

// Callback function for deviceready event
function onDeviceReady() {
  if ($.mobile.activePage.attr("id") === "home") {
    // Do something for the Home page
    $("#camera-button").click(function () {
      // Get a photo using the Camera plugin
      navigator.camera.getPicture(onSuccessHome, onError, {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
      });
    });
  } else if ($.mobile.activePage.attr("id") === "directions") {
    // Get the current position using the Geolocation plugin
    navigator.geolocation.getCurrentPosition(onSuccessDirections, onError, {
      maximumAge: 3000,
      timeout: 5000,
      enableHighAccuracy: true,
    });
  }
}

// Callback function for successful geolocation
function onSuccessDirections(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  // Create a Google Maps URL with the current latitude and longitude
  var url =
    "https://www.google.com/maps/search/?api=1&query=" +
    latitude +
    "," +
    longitude;

  // Create an iframe element with the Google Maps URL
  var iframe = $("<iframe>")
    .attr("src", url)
    .css({ width: "100%", height: "100%" });

  // Add the iframe element to the Directions page
  $("#map").empty().append(iframe);
}

// Callback function for failed geolocation
function onErrorDirections(error) {
  alert("Failed to get current position: " + error.message);
}

// Callback function for successful photo capture
function onSuccessHome(imageData) {
  // Create an image element with the captured photo
  var image = $("<img>").attr("src", "data:image/jpeg;base64," + imageData);

  // Add the image element to the Home page
  $("#photo").empty().append(image);
}

// Callback function for failed photo capture
function onErrorHome(message) {
  alert("Failed to capture photo: " + message);
}
