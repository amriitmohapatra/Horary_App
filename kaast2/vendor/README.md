# vendor/

| File | What | Origin | Licence |
|---|---|---|---|
| `swisseph.wasm` | Swiss Ephemeris 2.10.03 compiled to WebAssembly | copied unchanged from `Advanced_Setup/web/vendor/` (Kala Chakra 1.5) | AGPL-3.0 (Astrodienst AG dual licence) |
| `swisseph.data` | Ephemeris files `sepl_18`, `semo_18`, `seas_18` (1800–2399), asteroid-name catalogue dropped | same | AGPL-3.0 |
| `swisseph_glue.js` | Emscripten glue, patched to run as a classic script and under Node (`__kaast_require`) | same | AGPL-3.0 |

SHA-256 (verified by `scripts/build_contract_check.mjs` against every build):

```
2c39039161dc443850c93e23744d3f34dc1873b1417c5b59f41a70f5378db073  swisseph.wasm
1aac44b2ea3dfe668a063ed29dada99a7a96d8fa22fdce626cdf9e270b084ed0  swisseph.data
dc3a83def45eac14c784e7c9861af4afd8488e431942884f2d2d2bcf8c9cfff4  swisseph_glue.js
```

Using the Swiss Ephemeris makes KAAST 2 AGPL-3.0 (decision D9).
