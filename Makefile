#!/usr/bin/env make

.DEFAULT_GOAL	:= help
# TODO: test oneshell target (https://www.gnu.org/software/make/manual/html_node/One-Shell.html)
.ONESHELL:
export SHELL 	:= $(shell which sh)
# .SHELLFLAGS 	:= -eu -o pipefail -c
# MAKEFLAGS 		+= --warn-undefined-variables

# ENV VARS
ifneq (,$(wildcard .env))
	include .env
	export $(shell sed 's/=.*//' .env)
endif

export UNAME 	:= $(shell uname -s)

ifeq ($(UNAME), Darwin)
	export XCODE := $(shell xcode-select --install >/dev/null 2>&1; echo $$?)
endif

ifeq ($(UNAME), Darwin)
	export HOMEBREW_NO_INSTALLED_DEPENDENTS_CHECK := 1
endif

ifeq ($(shell command -v brew >/dev/null 2>&1; echo $$?), 0)
	export BREW := $(shell which brew)
endif

ifeq ($(shell command -v python >/dev/null 2>&1; echo $$?), 0)
	export PYTHON := $(shell which python3)
endif

ifeq ($(shell command -v pip >/dev/null 2>&1; echo $$?), 0)
	export PIP := $(shell which pip3)
endif

ifeq ($(shell command -v asdf >/dev/null 2>&1; echo $$?), 0)
	export ASDF := $(shell which asdf)
endif

ifeq ($(shell command -v hugo >/dev/null 2>&1; echo $$?), 0)
	export HUGO := $(shell which hugo)
endif

ifeq ($(shell command -v node >/dev/null 2>&1; echo $$?), 0)
	export NODE := $(shell which node)
endif

ifneq (,$(wildcard /etc/os-release))
	include /etc/os-release
endif

# colors
GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

# targets
.PHONY: all
all: sanity-check git help homebrew hugo install node npm update xcode

sanity-check:  ## output environment variables
	@echo "Checking environment..."
	@echo "UNAME: ${UNAME}"
	@echo "SHELL: ${SHELL}"
	@echo "ID: ${ID}"
	@echo "XCODE: ${XCODE}"
	@echo "BREW: ${BREW}"
	@echo "HOMEBREW_NO_INSTALLED_DEPENDENTS_CHECK: ${HOMEBREW_NO_INSTALLED_DEPENDENTS_CHECK}"
	@echo "PYTHON: ${PYTHON}"
	@echo "PIP: ${PIP}"

xcode: ## install xcode command line tools
	if [ "${UNAME}" = "Darwin" ] && [ "${XCODE}" -ne 1 ]; then \
		echo "Installing Xcode command line tools..."; \
		xcode-select --install; \
	elif [ "${UNAME}" = "Darwin" ] && [ "${XCODE}" -eq 1 ]; then \
		echo "xcode already installed."; \
	else \
		echo "xcode not available on macOS."; \
	fi

homebrew: ## install homebrew
	if [ "${UNAME}" = "Darwin" ] && [ -z "${BREW}" ]; then \
		echo "Installing Homebrew..."; \
		/bin/bash -c "$$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; \
	elif [ "${UNAME}" = "Darwin" ] && [ ! -z "${BREW}" ]; then \
		echo "Homebrew already installed."; \
	else \
		echo "brew not setup for OS. Yet."; \
	fi

update: ## update package manager
	@echo "Updating package manager..."
	if [ "${UNAME}" = "Darwin" ] && [ -z "${BREW}" ]; then \
		brew update; \
	elif [ "${ID}" = "ubuntu" ]; then \
		sudo apt update; \
	elif [ "${ID}" = "fedora" ]; then \
		sudo dnf update; \
	elif [ "${ID}" = "arch" ]; then \
		yes | sudo pacman -Syu; \
	fi

git: ## install git
	@echo "Installing Git..."
	if [ "${UNAME}" = "Darwin" ] && [ -z "${BREW}" ]; then \
		brew install git; \
	elif [ "${ID}" = "ubuntu" ]; then \
		sudo apt install -y git; \
	elif [ "${ID}" = "fedora" ]; then \
		sudo dnf install -y git; \
	elif [ "${ID}" = "arch" ]; then \
		yes | sudo pacman -S git; \
	else \
		echo "git already installed."; \
	fi

python: ## install python
	@echo "Installing Python..."
	if [ "${UNAME}" = "Darwin" ] && [ -z "${PYTHON}" ]; then \
		brew install python; \
	elif [ "${ID}" = "ubuntu" ]; then \
		sudo apt install -y python3; \
	elif [ "${ID}" = "fedora" ]; then \
		sudo dnf install -y python3; \
	elif [ "${ID}" = "arch" ]; then \
		yes | sudo pacman -S python; \
	else \
		echo "python already installed."; \
	fi

pip: python ## install pip
	@echo "Installing Pip..."
	if [ "${UNAME}" = "Darwin" ] && [ -z "${PYTHON})" ]; then \
		brew install python; \
	elif [ "${ID}" = "ubuntu" ] && [ -z "${PIP}" ]; then \
		sudo apt install -y python3-pip; \
	elif [ "${ID}" = "fedora" ] && [ -z "${PIP}" ]; then \
		sudo dnf install -y python3-pip; \
	elif [ "${ID}" = "arch" ] && [ -z "${PIP}" ]; then \
		yes | sudo pacman -S python-pip; \
	else \
		echo "pip already installed."; \
	fi

hugo: ## install hugo
	if [ -z "${HUGO}" ]; then \
		echo "Installing hugo..."; \
		if [ "${UNAME}" = "Darwin" ]; then \
			brew install hugo; \
		elif [ "${ID}" = "ubuntu" ]; then \
			sudo apt install -y hugo; \
		elif [ "${ID}" = "fedora" ]; then \
			sudo dnf install -y hugo; \
		elif [ "${ID}" = "arch" ]; then \
			yes | sudo pacman -S hugo; \
		fi; \
	else \
		echo "hugo already installed."; \
	fi

node: ## install node
	if [ -z "${NODE}" ]; then \
		echo "Installing node..."; \
		if [ "${UNAME}" = "Darwin" ]; then \
			brew install node; \
		elif [ "${ID}" = "ubuntu" ]; then \
			sudo apt install -y nodejs; \
		elif [ "${ID}" = "fedora" ]; then \
			sudo dnf install -y nodejs; \
		elif [ "${ID}" = "arch" ]; then \
			yes | sudo pacman -S nodejs; \
		fi; \
	else \
		echo "node already installed."; \
	fi

npm: ## install node modules
	@echo installing node modules...; \
	cd themes/thecodeboss && npm install

install: sanity-check update xcode homebrew git python pip hugo node npm ## install all dependencies

help: ## show this help
	@echo ''
	@echo 'Usage:'
	@echo '    ${YELLOW}make${RESET} ${GREEN}<target>${RESET}'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} { \
		if (/^[a-zA-Z_-]+:.*?##.*$$/) {printf "    ${YELLOW}%-20s${GREEN}%s${RESET}\n", $$1, $$2} \
		else if (/^## .*$$/) {printf "  ${CYAN}%s${RESET}\n", substr($$1,4)} \
		}' $(MAKEFILE_LIST)
