#!/bin/sh
set -e

# copy partition table
gzip -d -c board/olimex/imx233_olinuxino_wordclock/sd-card.img.gz > $1/sd-card.img

# copy partitions
dd if=$1/uboot-env.bin of=$1/sd-card.img bs=512 seek=512 conv=notrunc
dd if=$1/u-boot.sd of=$1/sd-card.img bs=512 seek=2048 conv=notrunc
dd if=$1/uImage.imx23-olinuxino of=$1/sd-card.img bs=512 seek=6144 conv=notrunc
dd if=$1/rootfs.squashfs of=$1/sd-card.img bs=512 seek=26624 conv=notrunc
