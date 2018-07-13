# Athloi

Athloi is a tool that optimizes the workflow around managing multi-package repositories with git and npm.

[monorepos]: https://github.com/babel/babel/blob/master/doc/design/monorepo.md


## Getting Started

Start by installing Athloi within your project using [npm].

```sh
npm install --save-dev athloi
```

[npm]: https://www.npmjs.com/

Athloi needs to know where your packages are located within your repository. Create a `monorepo.json` configuration file in root of your project and add a list of [globs] for each folder containing packages.

```json
{
  "packages": [
    "components/*",
    "packages/*"
  ]
}
```

[globs]: https://en.wikipedia.org/wiki/Glob_(programming)


## Commands

### run

Run an npm script in each package that contains that script.

```sh
athloi run build
```

### exec

Run an arbitrary command in each package. A double-dash (`--`) is necessary to pass dashed arguments to the script being executed.

```sh
athloi exec npm install
```

### script

Run a Node script in each package.

```sh
athloi script path/to/task.js
```


## What's with the name?

One of the twelve labours of Hercules (hoi hērakleous athloi) was to slay the Lernean Hydra.


## licence

isc
