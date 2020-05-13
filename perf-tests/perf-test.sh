#!/bin/sh

echo "[INFO] Run test on AJV"

npx loadtest -n 10000 http://localhost:3000/perf-test/ajv -P '{"nb1": 1, "nb2": 2}' -T application/json

echo "[INFO] Run test on JOI"

npx loadtest -n 10000 http://localhost:3000/perf-test/joi -P '{"nb1": 1, "nb2": 2}' -T application/json
