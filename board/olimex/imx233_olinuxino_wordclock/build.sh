#!/bin/sh
set -e

# save filesystem version
GIT=$(git describe --dirty)
DATE=$(date -R)

echo "$GIT $DATE" > $TARGET_DIR/build

# disable default remote
if [ -f $TARGET_DIR/etc/lirc/lircd.conf.d/devinput.lircd.conf ]; then
	mv $TARGET_DIR/etc/lirc/lircd.conf.d/devinput.lircd.conf $TARGET_DIR/etc/lirc/lircd.conf.d/devinput.lircd.dist
fi

# compress web directory
find output/target/usr/html/ -type f ! -iname "*.gz" | xargs -r gzip -fk9
