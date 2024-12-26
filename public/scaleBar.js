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

    const scaleBar = document.getElementsByClassName('scale-bar')[0];
    const scaleLabel = document.getElementsByClassName('scale-label')[0];

    function updateScaleBar() {
        const distanceInMetersPerPixelInMap = getDistanceInMetersPerPixelInMap()
        displayMapScale(distanceInMetersPerPixelInMap)
    }

    function getDistanceInMetersPerPixelInMap() {

        // Find the distance between two pixels at the bottom center of the screen.
        const width = viewer.scene.canvas.clientWidth;
        const height = viewer.scene.canvas.clientHeight;

        const left = viewer.scene.camera.getPickRay(new Cesium.Cartesian2((width / 2) | 0, height - 1));
        const right = viewer.scene.camera.getPickRay(new Cesium.Cartesian2(1 + (width / 2) | 0, height - 1));

        const globe = viewer.scene.globe;
        const leftPosition = globe.pick(left, viewer.scene);
        const rightPosition = globe.pick(right, viewer.scene);

        if (typeof leftPosition == "undefined" || typeof rightPosition == "undefined") {
            return -1;
        }

        const leftCartographic = globe.ellipsoid.cartesianToCartographic(leftPosition);
        const rightCartographic = globe.ellipsoid.cartesianToCartographic(rightPosition);

        const geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(leftCartographic, rightCartographic);
        const distanceInMetersPerPixel = geodesic.surfaceDistance;
        return distanceInMetersPerPixel;
    }

    function displayMapScale(distanceInMetersPerPixelInMap) {
        if (distanceInMetersPerPixelInMap < 0) {
            scaleLabel.textContent = '?';
            scaleBar.style.width = "100px";
            return;
        }

        const distanceInKmPerPixelInMap = distanceInMetersPerPixelInMap / 1000;

        const distances = [
            1, 2, 3, 5,
            10, 20, 30, 50,
            100, 200, 300, 500,
            1000, 2000, 3000, 5000,
            10000, 20000, 30000, 50000,
            100000, 200000, 300000, 500000,
            1000000, 2000000, 3000000, 5000000,
            10000000, 20000000, 30000000, 50000000
        ];

        // Find the first distance that makes the scale bar less than 100 pixels.
        var maxBarWidth = 100;
        var distance;
        var label;
        var units;

        for (var i = distances.length - 1; i >= 0; --i) {
            if (distances[i] / distanceInMetersPerPixelInMap < maxBarWidth) {
                if (distances[i] > 1000) { // Switch between meters and Km
                        for (var j = distances.length - 1; j >= 0; --j) {
                        if (distances[j] / distanceInKmPerPixelInMap < maxBarWidth) {
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
                scaleBar.style.width = ((distance / distanceInKmPerPixelInMap) | 0).toString() + "px";
            }
            else {
                scaleBar.style.width = ((distance / distanceInMetersPerPixelInMap) | 0).toString() + "px";
            }
            scaleLabel.textContent = label;
        } else {
            scaleBar.style.width = "100px";
            scaleLabel.textContent = "?";
        }    
    }

    // Zoom (camera height in Cesium) listener
    viewer.camera.moveEnd.addEventListener(updateScaleBar);
})