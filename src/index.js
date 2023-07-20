import {
  Ion,
  Viewer,
  Cartesian3,
  createOsmBuildingsAsync,
  createWorldTerrainAsync,
  IonResource,
  Math,
  Transforms,
  HeadingPitchRoll,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";

// Your access token can be found at: https://cesium.com/ion/tokens.
// This is the default access token
Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYmQ0M2IwMy05ODFmLTRjODgtOWUyYS1kZGI5YTgwN2ViZDQiLCJpZCI6MTA0MzQ5LCJpYXQiOjE2ODk4Nzk3NDd9.BNp5VhSTvUono4XMbAl6ah1rb36pGPJRlBBs5F2eN08";

// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
const viewer = new Viewer("cesiumContainer", {
  terrainProvider: await createWorldTerrainAsync(),
  infoBox: false,
  selectionIndicator: false,
  shadows: true,
  shouldAnimate: true,
});

// Add Cesium OSM Buildings, a global 3D buildings layer.
viewer.scene.primitives.add(await createOsmBuildingsAsync());
let { lat, lon } = await getPositionNow();
let position = Cartesian3.fromDegrees(lon, lat, 800000);
let heading = Math.toRadians(135);
let pitch = 0;
let roll = 0;
let hpRoll = new HeadingPitchRoll(heading, pitch, roll);
let orientation = Transforms.headingPitchRollQuaternion(position, hpRoll);

const airplaneUri = await IonResource.fromAssetId(2022206);
const airplaneEntity = viewer.entities.add({
  name: airplaneUri,
  position: position,
  orientation: orientation,
  model: {
    uri: airplaneUri,
    minimumPixelSize: 30,
  },
});

viewer.trackedEntity = airplaneEntity;
setInterval(async function () {
  let { lat: latn, lon: lonn } = await getPositionNow();
  let position = Cartesian3.fromDegrees(lonn, latn, 330000);
  let orientationn = Transforms.headingPitchRollQuaternion(position, hpRoll);
  airplaneEntity.orientation = orientationn;
  airplaneEntity.position = position;
  console.log(`lat: ${latn}, lon: ${lonn}`);
}, 1000);

async function getPositionNow() {
  const responce = await fetch("http://api.open-notify.org/iss-now.json");
  const data = await responce.json();
  let {
    iss_position: { longitude, latitude },
  } = data;
  return { lat: Number(latitude), lon: Number(longitude) };
}
