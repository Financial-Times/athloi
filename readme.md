# athloi

a cli tool for managing [lerna](https://github.com/lerna/lerna) monorepos

## usage (for monorepo maintainers)

at the top level of your monorepo

```sh
npm install --save-dev athloi
```

then in your `package.json` add something to the `scripts` entry to run `athloi`. i'd suggest adding it under `start`:

```json
"scripts": {
	"start": "athloi"
}
```

## usage (for developing in a monorepo)

if you're working in a monorepo with athloi installed, run it to get an interactive list of available tasks. e.g. if it's set up as the `start` script as above:

```
> npm start
? What do you want to do?
  Start the development server
❯ Run the production build
  Create a new package
  Run another script
```

choosing a task will tell you how to run that task as a shortcut:

```
? What do you want to do? build

  ☞ protip
  │ you can run this as npm start -- build
  ✔︎ which would be quicker


  ⛭ running build serially
  ⎘ in package-1, package-2 and package-3
```

## what's with the name

one of the twelve labours of heracles (hoi hērakleous athloi) was to slay the lernean hydra.

## licence

isc
