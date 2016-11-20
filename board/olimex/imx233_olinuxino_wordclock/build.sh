#!/bin/sh
set -e

GIT=$(git describe --dirty)
DATE=$(date -R)

echo "$GIT $DATE" > $TARGET_DIR/build

if [ -f $TARGET_DIR/etc/lirc/lircd.conf.d/devinput.lircd.conf ]; then
	mv $TARGET_DIR/etc/lirc/lircd.conf.d/devinput.lircd.conf $TARGET_DIR/etc/lirc/lircd.conf.d/devinput.lircd.dist
fi
