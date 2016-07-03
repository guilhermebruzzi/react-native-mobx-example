.PHONY: run android ios

help:
	@echo "Available Targets:"
	@cat Makefile | egrep '^([-a-zA-Z]+?):' | sed 's/:\(.*\)//g' | sed 's/^/- /g'

setup-npm:
	@npm install
	@npm dedupe
	@npm prune
	@npm install

setup: setup-npm
	@npm install -g appium@1.5.2 --no-shrinkwrap
	@npm install -g react-native-cli@0.2.0

reset-npm:
	@watchman watch-del-all
	@rm -rf node_modules
	@npm cache clean

reset: reset-npm setup-npm

start:
	@npm start

ios:
	react-native run-ios

android:
	react-native run-android

android-adb:
	adb reverse tcp:8081 tcp:8081

tests:
	npm test

test: tests

lint:
	@npm run lint

run: ios

openios:
	open ios/BSNAppHome.xcodeproj/
