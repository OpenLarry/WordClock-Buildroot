################################################################################
#
# wordclock
#
################################################################################

WORDCLOCK_VERSION = v0.3
WORDCLOCK_SITE = git@github.com:OpenLarry/WordClock.git
WORDCLOCK_SITE_METHOD = git
WORDCLOCK_DEPENDENCIES = host-vala libglib2 json-glib sdl sdl_image glib-networking libsoup libgee

define WORDCLOCK_INSTALL_INIT_SYSV
	$(INSTALL) -D -m 0755 package/wordclock/S50wordclock \
		$(TARGET_DIR)/etc/init.d/S50wordclock
endef


$(eval $(cmake-package))
