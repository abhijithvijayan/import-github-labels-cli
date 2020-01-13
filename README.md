# import-github-labels-cli [![npm version](https://img.shields.io/npm/v/import-github-labels)](https://www.npmjs.com/package/import-github-labels) [![Build Status](https://travis-ci.com/abhijithvijayan/import-github-labels-cli.svg?token=bJxrXYoNqDthzrKNTKiz&branch=master)](https://travis-ci.com/abhijithvijayan/import-github-labels-cli)

> CLI to import labels from another repository on GitHub

### 🙋‍♂️ Made by [@abhijithvijayan](https://twitter.com/_abhijithv)

<img src="demo.gif" width="752">

## Install

Ensure you have [Node.js](https://nodejs.org) 8 or later installed. Then run the following:

```
$ npm install --global import-github-labels
```

If you don't want to install the CLI globally, you can use `npx` to run the CLI:

```
$ npx import-github-labels --help
```

## Usage

```
$ import-github-labels --help

  Create GitHub repo from Command-line

  Usage
	  $ import-github-labels [input] [options]

  Input
		sync		    Import GitHub labels from a repo to another
  
  Options
		-v, --version   Show the version and exit with code 0

  Examples
		$ import-github-labels sync
```

## FAQ

### Generate new token

Goto [Personal access tokens](https://github.com/settings/tokens)

### Why do I need a token?

- For unauthenticated requests, the rate limit is 60 requests per
  hour.
  see [Rate Limiting](https://developer.github.com/v3/#rate-limiting)
- The token must be passed together when you want to automatically
  create the repository.

## Show your support

Give a ⭐️ if this project helped you!

## License

MIT © [Abhijith Vijayan](https://abhijithvijayan.in)