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

    function createScaleBar(viewer) {
        var scaleBarContainer = document.createElement('div');
        scaleBarContainer.className = 'cesium-scaleBar';
        viewer.container.appendChild(scaleBarContainer);

        var scaleBar = document.createElement('div');
        scaleBar.className = 'scale-bar';
        scaleBarContainer.appendChild(scaleBar);

        var scaleLabel = document.createElement('span');
        scaleBarContainer.appendChild(scaleLabel);

        function updateScaleBar() {
            var cameraHeight = viewer.camera.positionCartographic.height;
            var metersPerPixel = (cameraHeight / viewer.scene.canvas.clientHeight) * 2;
            var scaleDistance = metersPerPixel * 100; // Scale bar length in meters
            var scaleDistanceKm = scaleDistance / 1000; // Convert to kilometers

            // Adjust the scale bar length based on the distance
            var scaleBarLength = 100; // Base length in pixels
            scaleBar.style.width = scaleBarLength + 'px';
            scaleLabel.innerHTML = scaleDistanceKm.toFixed(2) + ' km';
        }

        viewer.scene.camera.moveEnd.addEventListener(updateScaleBar);
        viewer.scene.camera.moveStart.addEventListener(updateScaleBar);
        updateScaleBar(); // Initial update
    }

    createScaleBar(viewer);
});
