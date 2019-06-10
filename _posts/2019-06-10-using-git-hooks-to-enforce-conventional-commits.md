---
title: "Enforcing Conventional Commits using Git hooks"
layout: post
categories: guides git
blog: true
image: https://i.imgur.com/CLYvkIp.jpg
author: EndaPhelan
summary: "A guide on how to leverage the use of Git hooks to enforce conventional commits in your Git project"
description: "A guide on how to leverage the use of Git hooks to enforce conventional commits in your Git project"
tag: 
    - Git
    - Bash
    - Git Hooks
    - Conventional Commits
---

I'm a huge fan of [Conventional Commits](https://www.conventionalcommits.org). This relatively young specification provides a set of rules for creating an explicit, standardised commit history.

I've tried my best to follow the convention in all my projects. When I'm running low on caffeine I sometimes forget to follow the convention or a I let a typo slip past my eyes. To resolve this, I decided to create a dynamic `commit-msg` Git hook which automatically validates my commit message, and prevents them from being committed if any of the conditions fail.

## Creating the hook

**Note:** for the hook to read configuration values from a JSON file, you will need to install [jq](https://stedolan.github.io/jq/).

In your Git project, add a `commit-msg` hook in `.git/hooks` by renaming the sample script that is there already.

```sh
$ mv .git/hooks/commit-msg.sample .git/hooks/commit-msg
```

To start, let's read configuration values from a configuration file, which will later be added to the project's root.

```sh
config=commit-msg.config.json

# set variables
enabled=$(jq -r .enabled $config)
revert=$(jq -r .revert $config)
types=($(jq -r '.types[]' $config))
min_length=$(jq -r .length.min $config)
max_length=$(jq -r .length.max $config)
```

If the config file does not exist, or if the `enabled` property is false, we can exit the hook and skip validation.

```sh
if [[ ! -f $config || ! $enabled ]]; then
    exit 0
fi
```

## Building a dynamic regex string

Let's start the string with a hat symbol (`^`), which indicates the beginning of the string.

```sh
regexp="^("
```

If `$revert` is set to true, the commit message can optionally be prefixed with "revert:".

```sh
if $revert; then
    regexp="${regexp}revert: )?(\w+)("
fi
```

Let's get all of the allowed types from `commit-msg.config.json`.

```sh
for type in "${types[@]}"
do
    regexp="${regexp}$type|"
done
```

This next piece does two things. If an opening bracket comes immediately after the type, It must be closed and contain a scope. The second thing is that the type and/or scope must be followed with a colon symbol (:).

```sh
regexp="${regexp})(\(.+\))?: "
```

Here were are setting limits on the maximum and minimum length of the message immediately after the colon.

```
regexp="${regexp}.{$min_length,$max_length}$"
```

### Validating the commit message

Now that the regex has been built, let's see some examples of how the commit message could look.

```
revert: docs: updated table of contents
feat(user): added constructor to model
fix: incorrect URL in link
```

Get the first line of the commit message:

```sh
msg=$(head -1 $1)
```

In the following statement, we are checking if the commit message passes the regex validation. If it fails, print out a custom error message and exit the script.

```sh
if [[ ! $msg =~ $regexp ]]; then
  echo -e "\n\e[1m\e[31m[INVALID COMMIT MESSAGE]"
  echo -e "------------------------\033[0m\e[0m"
  echo -e "\e[1mValid types:\e[0m \e[34m${types[@]}\033[0m"
  echo -e "\e[1mMax length (first line):\e[0m \e[34m$max_length\033[0m"
  echo -e "\e[1mMin length (first line):\e[0m \e[34m$min_length\033[0m\n"

  # exit with an error
  exit 1
fi
```

### Configuration

The great thing about the Conventional Commit specification is its flexibility. You choose the rules that best suit your requirements. This flexibility is why I decided to make my hook configurable. Below is a sample configuration file. 

Add it to the root of your project and make sure it matches the file name in the script; which in this case is `commit-msg.config.json`.

```json
{
    "enabled": true,
    "revert": true,
    "length": {
        "min": 1,
        "max": 52
    },
    "types": [
        "build",
        "ci",
        "docs",
        "feat",
        "fix",
        "perf",
        "refactor",
        "style",
        "test",
        "chore"
    ]
}
```

## Making your Git hook global

It is possible to create global Git hooks which are added to all of your projects on `git init`.

Enable Git templates:

```sh
git config --global init.templatedir '~/.git-templates'
```

Create a directory to save your global hooks:

```sh
mkdir -p ~/.git-templates/hooks
```

Create a `commit-msg` hook in `~/.git-templates/hooks/commit-msg`, and make it executable:

```sh
touch ~/.git-templates/hooks/commit-msg
chmod u+x ~/.git-templates/hooks/commit-msg
```

You can repeat the steps from <a href="#making-the-hook">**Making the hook**</a> and add them to the global `commit-msg` hook.

### Sailr

If you'd rather not do any of the above, and want a ready-to-go solution, I've made this into its own project called [Sailr](https://github.com/craicoverflow/sailr).

Here's how you can install Sailr:

```sh
git clone https://github.com/craicoverflow/sailr
cd sailr
make install
```