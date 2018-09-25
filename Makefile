IGNORE_A11Y = true

node_modules/@financial-times/n-gage/index.mk:
	npm install @financial-times/n-gage
	touch $@

-include node_modules/@financial-times/n-gage/index.mk

unit-test:
	export NODE_ENV=test; jest --verbose --env node
	@$(DONE)

unit-test-coverage:
	export NODE_ENV=test; jest --coverage --env node
	@$(DONE)

test: verify unit-test
