#!/bin/sh
set -e

GIT=$(git describe --dirty)
DATE=$(date -R)

echo "$GIT $DATE" > $TARGET_DIR/build
