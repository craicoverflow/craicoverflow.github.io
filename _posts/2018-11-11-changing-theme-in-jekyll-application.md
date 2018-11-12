---
layout: post
title:  "How to change the theme in your Jekyll application"
date:   2018-11-11
categories: technology programming
excerpt: "A step by step guide to changing theme in your Jekyll application."
tag:
- jekyll
- programming
- web development
- tutorial
- guide
- html
comments: true
---

Follow these steps and you will be able to change the theme in your Jekyll application.

Create a new orphan branch and ensure it is empty.

```bash
git checkout --orphan newtheme
git rm -rf .
git clean -dfx
```

Now let's add the theme's repository as an upstream remote and pull the files into our branch. I am using Moon theme by [Taylan Tatlı](https://taylantatli.github.io/).

```bash
git remote add upstream https://github.com/TaylanTatli/Moon.git
git fetch upstream
git pull upstream master
```

Install Gem dependencies and run your application to see if the previous steps were successful.

```bash
bundle install
jekyll serve
```

All okay so far? Good. Now it's time to merge your blog posts, configuration and other custom files.

This will bring in your posts from `master`:
```bash
git checkout master -- _posts
```

You can safely merge these files and folders:

- `README.md` and other custom Markdown files.
- `_posts` directory.
- `_drafts` directory.
- `CNAME` file.
- Favicon files.
- Other custom files and directories such as pictures.

Some old files will conflict with ones from your new theme. The safest thing to do here is to copy the file to a new name and merge it manually.

```bash
git show master:_config.yml > _config.yml.old
```

Accidentally overwritten a theme file? No problem:

```bash
git checkout upstream/master -- index.md
```

I recommend manually merging these files:

- `_config.yml`
- `Gemfile`

Now replace `master` with the `newtheme` branch:

```bash
git checkout newtheme
git merge -s ours master --allow-unrelated-histories
git checkout master
git merge
```

Run the application again to see if your changes have come through:

```bash
jekyll serve
```

Push your changes:

```bash
git push
```

Leave no evidence of the crime by deleting the `newtheme` branch.

```
git branch -d newtheme
```

## Credits

This solution is from <a href="https://stackoverflow.com/a/37186333" target="_blank">this StackOverflow answer</a> by Daniel Pelsmaeker and adapted to work with the latest versions of Git, Bundler and Jekyll.
