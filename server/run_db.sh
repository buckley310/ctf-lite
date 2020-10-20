#!/bin/sh
set -ex

exec mongod --dbpath "$(mktemp -d)"
