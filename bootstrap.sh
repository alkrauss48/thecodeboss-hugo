#!/usr/bin/env bash

# SOURCES:
# https://github.com/alkrauss48/thecodeboss-hugo#to-run
# https://gohugo.io/about/

# shellcheck disable=SC2046,SC2086,SC2116,SC2155,SC2164,SC2276,SC2317

cat << 'DESCRIPTION' >/dev/null
Runs a Hugo server with live reload for development purposes.

Usage:
  ./bootstrap.sh
DESCRIPTION

# set $IFS to eliminate whitespace in pathnames
IFS="$(printf '\n\t')"

# trap function
trap_card() {
	echo "Caught EXIT/SIGINT/SIGTERM. Cleaning up..."
	NPM_PID=$(pgrep -f "npm run")
	HUGO_PID=$(pgrep -f "hugo server")
	for pid in "${NPM_PID}" "${HUGO_PID}"; do
		if [[ -n "${pid}" ]]; then
			kill -15 "${pid}" 2>/dev/null
		fi
	done
	unset IFS
	exit 0
}
trap trap_card EXIT SIGINT SIGTERM

# source .env file skipping commented lines
if [[ -f .env ]]; then
	export $(grep -v '^#' .env | xargs)
fi

# if port is not set, set it to 1313
if [[ -z "${PORT}" ]]; then
	PORT=1313
fi

# top-level directory via git
TLD="$(git rev-parse --show-toplevel)"

# make install
make_install() {
	if [[ -f "Makefile" ]]; then
		make install
	fi
}

# build css in subshell
css_watch() {
	cd "${TLD}/themes/thecodeboss"
	npm run css-watch &
}

# build js in subshell
js_watch() {
	cd "${TLD}/themes/thecodeboss"
	npm run js-watch &
}

# open browser to localhost
open_browser() {
	if [[ $(uname -s) = "Darwin" ]]; then
		open "http://localhost:${PORT}"
	elif [[ $(uname -s) = "Linux" ]]; then
		xdg-open "http://localhost:${PORT}"
	else
		echo -e "OS not supported.\nPlease open your browser to http://localhost:${PORT}"
	fi
}

# start hugo server
start_server() {
	cd "${TLD}"
	# https://gohugo.io/commands/hugo/#options
	args=(
		"--disableFastRender"
		# "--gc"
		# "--ignoreCache"
		# "--minify"
		# "--renderToMemory"
		# "--templateMetrics"
		# "--templateMetricsHints"
		# "--verbose"
		# "--watch"
	)
	hugo server "${args[@]}" &
	local PID=$!
	open_browser
	wait "${PID}"
}

# run functions with arguments
main() {
	make_install
	css_watch
	js_watch
	start_server
}
main "$@"

exit 0
