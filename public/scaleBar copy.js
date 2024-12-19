document.addEventListener('DOMContentLoaded', function() {
    Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyZTU4ODhjYi0yNTI2LTQ3OGQtOWRiMC03OGY4NzFmODRhMDciLCJpZCI6MTE0MjEsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NTg5NDYyMTl9.ZciTakOUpR3h8bItUzE2QqfLEna8i9I3KeljlEKsXcY';

    const viewerOptions = {
        animation: false,
        timeline: false,
        // infoBox: false
    };

    const viewer = new Cesium.Viewer('cesiumContainer', viewerOptions);

    function createScaleBar(viewer) {
        var scaleBarContainer = document.createElement('div');
        scaleBarContainer.className = 'cesium-scaleBar';
        viewer.container.appendChild(scaleBarContainer);

        function updateScaleBar() {
            var cameraHeight = viewer.camera.positionCartographic.height;
            var scale = Math.pow(10, Math.floor(Math.log(cameraHeight) / Math.LN10));
            var distance = scale / 1000; // Convert to kilometers
            scaleBarContainer.innerHTML = 'Scale: ' + distance.toFixed(2) + ' km';
        }

        viewer.scene.camera.moveEnd.addEventListener(updateScaleBar);
        updateScaleBar(); // Initial update
    }

    createScaleBar(viewer);
});
