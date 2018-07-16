# Athloi

Athloi is a tool to assist with the management of multi-package repositories (a.k.a. [monorepos]) with git and npm. It provides an interface to execute commands and scripts within the scope of each package.

[monorepos]: https://github.com/babel/babel/blob/master/doc/design/monorepo.md
[lerna]: https://lernajs.io/

## Getting Started

Start by installing Athloi within your project using [npm].

```sh
npm install --save-dev athloi
```

[npm]: https://www.npmjs.com/

Configuration can be passed to Athloi by providing a `monorepo.json` file in your repository root. This must include a `packages` property which is a list of [globs] matching the directories containing your packages.

```json
{
  "packages": [
    "components/*",
    "packages/*",
    "tools/*"
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

Run an arbitrary command in each package.

```sh
athloi exec npm install
```

A double-dash (`--`) is necessary to pass dashed arguments to the script being executed.

```sh
athloi exec -- npm i -D
```


### script

Run a Node script in each package.

```sh
athloi script path/to/task.js
```


## What's with the name?

One of the twelve labours of Hercules (hoi hērakleous athloi) was to slay the Lernean Hydra. This is a nod to [Lerna].

[Lerna]: https://github.com/lerna/lerna


## licence

isc
