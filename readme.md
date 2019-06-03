# Athloi

[![CircleCI](https://circleci.com/gh/Financial-Times/athloi/tree/master.svg?style=svg)](https://circleci.com/gh/Financial-Times/athloi/tree/master)

Athloi is a tool to assist with the management of multi-package repositories (a.k.a. [monorepos]) with git and npm. It provides an interface to execute commands and scripts within the scope of each package.

[monorepos]: https://github.com/babel/babel/blob/master/doc/design/monorepo.md


## Features

- Provides a number of helpers to improve your monorepo workflow such as: installing all dependencies, running npm or custom scripts, publishing public packages, updating version numbers, etc.
- Capable of running tasks serially or in parallel whilst preserving topological sort order between cross-dependent packages.
- Options to filter the packages to target either by name or `package.json` field
- Works well with Yarn workspaces.


## Getting Started

Start by installing Athloi within your project using [npm].

```sh
npm install --save-dev @financial-times/athloi
```

[npm]: https://www.npmjs.com/

Next you must configure where Athloi should look for the directories containing your packages. To do this you must add an extra `"workspaces"` property to your root `package.json` file if you do not have one already.

This property is an array of [globs] matching your package directories. This designed to be compatible with [Yarn].

```json
{
  "workspaces": ["components/*", "tools/*"]
}
```

[globs]: https://en.wikipedia.org/wiki/Glob_(programming)
[Lerna]: https://lernajs.io/
[Yarn]: https://yarnpkg.com/en/


## Commands

_Please note:_ Before executing a command Athloi will sort the packages [topologically] based on their cross-dependencies and run tasks in this order.

### exec

Runs an arbitrary command within the scope of each package.

```sh
athloi exec npm install
```

A double-dash (`--`) is necessary to pass any dashed arguments to the command being executed.

```sh
athloi exec -- npm i -D lodash
```

### run

Runs an [npm script] in each package that defines that script.

```sh
athloi run build
```

[npm script]: https://docs.npmjs.com/misc/scripts

### script

Runs the given Node script in the scope of each package.

```sh
athloi script path/to/task.js
```

### version

Updates the release number for public packages and their cross-dependencies and writes the data back to `package.json`. The given tag must parseable as a valid semver number.

```sh
athloi version v1.0.0
```

Please note that when using the `version` command with the [filter option](#filter) any cross-dependent packages which have been excluded will fall back to their latest published version on npm.

### publish

Runs [`npm publish`][npm-publish] in the scope of each public package.

```sh
athloi publish
```

Dashed arguments may be passed using a double dash (`--`)

```sh
athloi publish -- --access=public
```

[npm-publish]: https://docs.npmjs.com/cli/publish


## Options

### concurrency

A global option which will execute up to the given number of tasks concurrently. By default one task will be run at a time.

```sh
# run a lint script in up to 3 packages at a time
athloi run lint --concurrency 3
```

### preserve-order

A global flag which will ensure tasks maintain topological sort order. When used with a concurrency value higher than 1 this option will force queued tasks to wait for any still running tasks in cross-dependent packages to finish first.

```sh
# run a concurrent build script but ensure dependencies are built first
athloi run build --concurrency 5 --preserve-order
```

### filter

A global option which can be used for all tasks. It filters packages based on the value of a field within their package manifest or the package name.

```sh
# Run a build script in only the packages marked as private
athloi run build --filter private:true
```

The value of the field will be coerced using `JSON.parse()` so boolean and number values can be used and string values must use double-quotes.

Property values inside arrays and objects can also be matched:

```sh
# Run the script for packages with a keyword of "demo"
athloi run build --filter 'keywords:"demo"'

# Run the script for packages with a dependency on the "lodash" package
athloi run build --filter 'dependencies:"lodash"'
```

The field name preceeding the colon (`:`) is optional and if omitted Athloi will default to checking package names, ignoring the npm organisation name.

```sh
# Run a build script for only the package named "@financial-times/x-interaction"
athloi run build --filter x-interaction
```

When filtering by package name you can also use a [glob pattern] to match them using wildcard characters:

```sh
# Run a build script for all packages with names beginning "@financial-times/x-"
athloi run build --filter 'x-*'
```

[glob pattern]: https://en.wikipedia.org/wiki/Glob_(programming)


## What's with the name?

One of the twelve labours of Hercules (hoi hērakleous athloi) was to slay the Lernean Hydra.


## licence

isc
