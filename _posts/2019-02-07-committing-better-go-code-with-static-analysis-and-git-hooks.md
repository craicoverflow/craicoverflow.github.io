---
title: 'Committing Better Go Code with Static Analysis and Git Hooks'
layout: post
categories: guides golang
blog: true
summary: "An introduction to some popular static analysis tools for Go and how to automate them using Git hooks"
tag:
  - Go
  - Programming
  - Golang
  - Git
  - Git Hooks
  - Linters
  - Automation
  - Code Analysis
---

<img class="image" src="{{site.image_cdn}}/UkfFo63.jpg">

I've been using Go for a while now and there are three static analysis tools (linters) that I use daily. There are [dozens more](https://github.com/golangci/awesome-go-linters) that I could be using, but I don't think it's wise to become too dependent on these tools (most of which are unofficial) to do your job for you. Eventually they will become a nightmare to track, maintain and they may eventually become unmaintained or unsupported.

### Gofmt

[Gofmt](https://golang.org/cmd/gofmt/) is an official tool for formatting Go code that has come as part of the language since 2013.

It's as simple as this to format a file:

```sh
$ go fmt main.go
```

Or you can target an entire package:

```sh
$ go fmt ./pkg/models
```

To format all packages (excluding `vendor`) beneath the current directory:

```sh
$ go fmt $(go list ./... | grep -v /vendor/)
```

### errcheck

In the maker's own words, [errcheck](https://github.com/kisielk/errcheck) "checks that you checked errors". In other words, it will scan your code and tell you if there are any errors. This can be useful for those times you sillily forget to run your application after making a small change.

To check errors in a package:

```sh
$ errcheck ./pkg/models
```

Or to scan all packages (excluding `vendor`) beneath the current directory:

```sh
errcheck $(go list ./... | grep -v /vendor/)
```

### Vet

Vet is another official static analysis tool in Go. Vet inspects the source code for suspicious constructs, such as Printf calls whose arguments do not align with the format string.

It's execution is very similar to that of Gofmt.

Vetting a single file:

```sh
$ go vet main.go
```

Vetting an entire package:

```sh
$ go vet ./pkg/models
```

Vetting all packages (excluding `vendor`) beneath the current directory:

```sh
$ go fmt $(go list ./... | grep -v /vendor/)
```

## Automating These Tools With Git Hooks

[Git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks) are a great way to automate these repetitive tasks and ensure you don't commit or push any incomplete code. The hooks are all stored in the `.git/hooks` subdirectory of your Git project and will automatically execute on or after a pre-defined list of Git events.

For this, we are going to bind to the `pre-commit` hook as we only want our script to check the files before committing them to Git. 

Create a new file in `.git/hooks` called `pre-commit` and open it in your favourite editor. Make it executable by running `chmod +x .git/hooks/pre-commit` from the terminal.

First, let's store the list of files in our project into a variable called `FILES`:

```sh
FILES=$(go list ./...  | grep -v /vendor/)
```

Add Gofmt next to format your code:

```sh
go fmt ${FILES}
```

Once formatted, the most important thing we need to check for is if there are any errors. If there are we can exit the script and prevent the commit.

```sh
{
	errcheck -ignoretests ${FILES}
} || {
	exitStatus=$?

	if [ $exitStatus ]; then
		printf "\nErrors found in your code, please fix them and try again."
		exit 1
	fi
}
```

If the code is error-free, the next thing we should check is if there are any suspicious constructs.

```sh
{
	go vet ${FILES}
} || {
	exitStatus=$?

	if [ $exitStatus ]; then
		printf "\nIssues found in your code, please fix them and try again."
		exit 1
	fi
}
```

Here's the complete `pre-commit` hook. Add this to your project today and start committing better Go code.

{% gist 204d155278099a18877b42b3d5e6a772 %}