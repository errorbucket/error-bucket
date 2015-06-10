#!/bin/sh
# Send a email to recipients.
#
# mutt must be installed for this script to run
#
# @param string $content_type Email content mime type: 'html' or 'plain'.
# @param string $from_address Sender email.
# @param string $subject Email subject.
# @param string $file Email contents.
# @param array $recipients Email recipients.

[[ ${#} -lt 5 ]] && exit 1
type mutt >/dev/null 2>&1 || { echo >&2 "mutt is not installed. Aborting."; exit 1; }

content_type="${1}"
from_address="${2}"
subject="${3}"
file="${4}"

# Remove all args but recipients.
shift 4

mutt -e "set content_type=text/${content_type} from=${from_address}" -s "${subject}" ${@} < ${file}
