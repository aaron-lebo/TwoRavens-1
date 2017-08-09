"""
Constants used to track the app names and url between the frontend and rook
"""
# Used for tracking the routing.
#
# Examplee.g ZELIG_APP is the constant used in logs
#
# format:  (app name, frontend url suffix, rook url suffix)
#
# example: ('ZELIG_APP', 'zeligapp', 'zeligapp')
#
ROOK_APP_NAMES = (('ZELIG_APP', 'zeligapp', 'zeligapp'),
                  ('DATA_APP', 'dataapp', 'dataapp'))

# Look up by frontend name
#
ROOK_APP_FRONTEND_LU = {info[1]: info for info in ROOK_APP_NAMES}
