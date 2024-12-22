document.addEventListener('DOMContentLoaded', function () {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZTU4ODhjYi0yNTI2LTQ3OGQtOWRiMC03OGY4NzFmODRhMDciLCJpZCI6MTE0MjEsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NTg5NDYyMTl9.ZciTakOUpR3h8bItUzE2QqfLEna8i9I3KeljlEKsXcY';

    var viewer = new Cesium.Viewer('cesiumContainer', {
        animation: false,
        timeline: false,
        fullscreenButton: false,
        vrButton: false,
        infoBox: false,
        selectionIndicator: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        geocoder: false
    });

    // const scaleBarElement = document.getElementById("scalebar");
    // const scaleBarTagElement = document.getElementById("scalebartag");
    // console.log(1, scaleBarElement, scaleBarTagElement)
    // Copilot
    let scaleBar;
    let scaleLabel;


    //Zoom listener
    viewer.camera.moveEnd.addEventListener(function () {
        // the camera stopped moving
        updateScaleBar();
    });

    //
    // Based on https://community.cesium.com/t/distance-scale-indicator/10371/11? 
    //
    function updateScaleBar() {
        var geodesic = new Cesium.EllipsoidGeodesic();
        var distances = [
            1, 2, 3, 5,
            10, 20, 30, 50,
            100, 200, 300, 500,
            1000, 2000, 3000, 5000,
            10000, 20000, 30000, 50000,
            100000, 200000, 300000, 500000,
            1000000, 2000000, 3000000, 5000000,
            10000000, 20000000, 30000000, 50000000];

        // Find the distance between two pixels at the bottom center of the screen.
        var width = viewer.scene.canvas.clientWidth;
        var height = viewer.scene.canvas.clientHeight;

        var left = viewer.scene.camera.getPickRay(new Cesium.Cartesian2((width / 2) | 0, height - 1));
        var right = viewer.scene.camera.getPickRay(new Cesium.Cartesian2(1 + (width / 2) | 0, height - 1));

        var globe = viewer.scene.globe;
        var leftPosition = globe.pick(left, viewer.scene);
        var rightPosition = globe.pick(right, viewer.scene);

        if (typeof leftPosition == "undefined" || typeof rightPosition == "undefined") {
            // scaleBarTagElement.textContent = "?";
            scaleLabel.textContent = "?";
            // $("#scalebartag").text("undefined");
            return;
        }

        var leftCartographic = globe.ellipsoid.cartesianToCartographic(leftPosition);
        var rightCartographic = globe.ellipsoid.cartesianToCartographic(rightPosition);

        geodesic.setEndPoints(leftCartographic, rightCartographic);
        var pixelDistance = geodesic.surfaceDistance; // meters
        var pixelDistanceInKm = pixelDistance / 1000;
        // var pixelDistance = geodesic.surfaceDistance * 3.28084; //meters to feet
        // var pixelDistanceMiles = pixelDistance / 5280;

        // Find the first distance that makes the scale bar less than 100 pixels.
        var maxBarWidth = 100;
        var distance;
        var label;
        var units;

        for (var i = distances.length - 1; i >= 0; --i) {
            if (distances[i] / pixelDistance < maxBarWidth) {
                // if (distances[i] > 5280) {
                if (distances[i] > 1000) { // Switch between meters and Km
                        for (var j = distances.length - 1; j >= 0; --j) {
                        if (distances[j] / pixelDistanceInKm < maxBarWidth) {
                            distance = distances[j];
                            units = " km";
                            break;
                        }
                    }
                    break;
                }
                else {
                    distance = distances[i];
                    units = " m";
                    break;
                }
            }
        }

        if (typeof distance !== "undefined") {

            label = distance.toString() + units;

            if (units === " km") {
                // scaleBarElement.style.width = ((distance / pixelDistanceInKm) | 0).toString() + "px";
                scaleBar.style.width = ((distance / pixelDistanceInKm) | 0).toString() + "px";
            }
            else {
                // scaleBarElement.style.width = ((distance / pixelDistance) | 0).toString() + "px";
                scaleBar.style.width = ((distance / pixelDistance) | 0).toString() + "px";
            }

            // scaleBarTagElement.textContent = label;
            scaleLabel.textContent = label;
            // $("#scalebartag").text(label);
        } else {
            // scaleBarElement.style.width = "100px";
            scaleBar.style.width = "100px";
            // scaleBarTagElement.textContent = "?";
            scaleLabel.textContent = "?";
            // $("#scalebartag").text("undefined");
        }
    }

    function createScaleBar(viewer) {
        console.log(2, 'Creating scale bar')
        var scaleBarContainer = document.createElement('div');
        scaleBarContainer.className = 'cesium-scaleBar';
        viewer.container.appendChild(scaleBarContainer);

        scaleBar = document.createElement('div');
        scaleBar.className = 'scale-bar';
        scaleBarContainer.appendChild(scaleBar);

        scaleLabel = document.createElement('span');
        scaleBarContainer.appendChild(scaleLabel);

        viewer.scene.camera.moveEnd.addEventListener(updateScaleBar);
        viewer.scene.camera.moveStart.addEventListener(updateScaleBar);
        updateScaleBar(); // Initial update
    }

    createScaleBar(viewer);
})