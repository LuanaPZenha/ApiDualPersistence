#!/bin/sh
# Hook helper: remove linhas de co-autoria do Cursor em mensagens de commit.
# Instalado em .git/hooks/prepare-commit-msg pelo setup abaixo.

MSG_FILE="$1"
[ -z "$MSG_FILE" ] && exit 0
[ ! -f "$MSG_FILE" ] && exit 0

sed -i -E '/^Co-authored-by:.*[Cc][Uu][Rr][Ss][Oo][Rr]/Id; /^Co-authored-by:.*cursoragent/Id' "$MSG_FILE"
exit 0
