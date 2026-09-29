import assert from "node:assert/strict";
import test from "node:test";

import {
  DeviceLocationError,
  mapGeolocationError,
  requestDeviceLocation,
} from "../scripts/device-location.js";

test("device location is requested only when the action function is called", async () => {
  let calls = 0;
  const geolocation = {
    getCurrentPosition(success, _error, options) {
      calls += 1;
      assert.deepEqual(options, {
        enableHighAccuracy: false,
        maximumAge: 300_000,
        timeout: 8_000,
      });
      success({ coords: { latitude: 41.878113, longitude: -87.629799 } });
    },
  };
  assert.equal(calls, 0);
  const location = await requestDeviceLocation({ geolocation });
  assert.equal(calls, 1);
  assert.equal(location.label, "Current location");
  assert.equal(location.latitude, 41.878113);
});

test("unsupported device location keeps a manual-search recovery message", async () => {
  await assert.rejects(
    requestDeviceLocation({ geolocation: null }),
    (error) => error instanceof DeviceLocationError
      && error.code === "unsupported"
      && /Search for a US city/.test(error.message),
  );
});

test("permission, unavailable, timeout, and unknown errors stay distinct", () => {
  assert.equal(mapGeolocationError({ code: 1 }).code, "permission-denied");
  assert.equal(mapGeolocationError({ code: 2 }).code, "unavailable");
  assert.equal(mapGeolocationError({ code: 3 }).code, "timeout");
  assert.equal(mapGeolocationError({ code: 9 }).code, "unknown");
});

test("malformed device coordinates fail as unavailable", async () => {
  const geolocation = {
    getCurrentPosition(success) {
      success({ coords: { latitude: Number.NaN, longitude: -87.6 } });
    },
  };
  await assert.rejects(
    requestDeviceLocation({ geolocation }),
    (error) => error.code === "unavailable",
  );
});
