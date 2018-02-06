# WordClock Buildroot

## Requirements
* Check out buildroot requirements: https://buildroot.org/downloads/manual/manual.html#requirement
* About __15GB__ of free disk space

## Compilation

1. Clone repository:
   
   `git clone --recursive git@github.com:OpenLarry/WordClock-Buildroot.git`
2. Change directory:
   
   `cd WordClock-Buildroot`
3. Set buildroot configuration:
   
   `make olimex_imx233_olinuxino_wordclock_defconfig`
4. Run build process:
   
   `make`
5. Wait. Build time depends on hardware configuration and internet speed.
6. Change into generated output directory:
   
   `cd output/images`
7. Here you can find the SD card image (`sd-card.img`) and all parts of it:
   
   * `u-boot.sd` boot loader
   * `uboot-env.bin` boot loader configuration
   * `uImage.imx233-olinuxino` linux kernel
   * `rootfs.squashfs` root filesystem
   
8. Copy to SD card:
   
   `dd if=sd-card.img of=/dev/mmcblk0 bs=4096` (replace mmcblk0 with your card reader device)

## About buildroot

Buildroot is a simple, efficient and easy-to-use tool to generate embedded
Linux systems through cross-compilation.

The documentation can be found in docs/manual. You can generate a text
document with 'make manual-text' and read output/docs/manual/manual.text.
Online documentation can be found at http://buildroot.org/docs.html

To build and use the buildroot stuff, do the following:

1. run 'make menuconfig'
2. select the target architecture and the packages you wish to compile
3. run 'make'
4. wait while it compiles
5. find the kernel, bootloader, root filesystem, etc. in output/images

You do not need to be root to build or run buildroot.   Have fun!

Buildroot comes with a basic configuration for a number of boards. Run
'make list-defconfigs' to view the list of provided configurations.

Please feed suggestions, bug reports, insults, and bribes back to the
buildroot mailing list: buildroot@buildroot.org
You can also find us on #buildroot on Freenode IRC.

If you would like to contribute patches, please read
https://buildroot.org/manual.html#submitting-patches
