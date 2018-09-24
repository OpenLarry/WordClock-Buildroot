################################################################################
#
# wordclock
#
################################################################################

WORDCLOCK_VERSION = custom
WORDCLOCK_SITE = sub_wordclock
WORDCLOCK_SITE_METHOD = local
WORDCLOCK_DEPENDENCIES = host-vala libglib2 json-glib glib-networking libsoup libgee luajit cairo pango dejavu wpa_supplicant

define WORDCLOCK_INSTALL_INIT_SYSV
	$(INSTALL) -D -m 0755 package/wordclock/S50wordclock \
		$(TARGET_DIR)/etc/init.d/S50wordclock
endef


$(eval $(cmake-package))
