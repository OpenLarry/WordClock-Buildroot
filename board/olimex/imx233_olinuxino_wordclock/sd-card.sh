#!/bin/sh
set -e

if [ -e $1/sd-card.img ]; then
	rm $1/sd-card.img
fi


fssize=$(stat --printf="%s" $1/rootfs.ext2)
imgsize=$(expr $fssize / 512 + 4096)

dd if=/dev/zero of=$1/sd-card.img bs=512 count=$imgsize

# echo "n
# p
# 1
# 
# +1M
# t
# 53
# n
# p
# 2
# 
# 
# w
# " | fdisk -b 512 -H 62 -S 62 $1/sd-card.img

dd if=board/olimex/imx233_olinuxino_wordclock/mbr.bin of=$1/sd-card.img bs=512
dd if=$1/uboot-env.bin of=$1/sd-card.img bs=512 seek=512
dd if=$1/u-boot.sd of=$1/sd-card.img bs=512 seek=2048
dd if=$1/rootfs.ext2 of=$1/sd-card.img bs=512 seek=4096
