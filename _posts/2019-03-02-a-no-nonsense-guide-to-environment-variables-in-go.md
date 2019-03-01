---
title: 'A no-nonsense guide to environment variables in Go'
layout: post
categories: guides golang
blog: true
image: https://i.imgur.com/1eNgrht.png
author: EndaPhelan
summary: "A step-by-step guide on how to configure your Go application with environment variables"
description: "A step-by-step guide on how to configure your Go application with environment variables"
tag:
  - Go
  - Golang
  - Programming
  - Environment Variables
  - Config
  - Configuration
  - Tutorial
  - Software
  - 12-Factor App
---

Environment variables are the best way to set configuration values for your software application as they can be defined at system-level, independently of the software. This is one of the principles of the [Twelve-Factor App](https://12factor.net/config) methodology and enables applications to be built with portability.

<p style="text-align:center;">
  <img class="image" src="{{site.image_cdn}}/1eNgrht.jpg">
</p>

## Using environment variables

All you need to interact with environment variables is the standard [`os`](https://golang.org/pkg/os/) package. Here is
an example of how you can access the system `PATH` environment variable.

{% gist e79ed163b202ed12f664ceafd93484e4 %}

It’s equally easy to set environment variables:

{% gist 025290c6e61a5c58d12608d7c55a6d4b %}

### Loading environment variables from a .env file

It is not always practical to set environment variables on development machines
where multiple projects are running.

[godotenv](https://github.com/joho/godotenv) is a Go port of the Ruby
[dotenv](https://github.com/bkeepers/dotenv) library. This allows you to define
your application’s environment variables in a `.env` file. 

To install the package run:

```sh
$ go get github.com/joho/godotenv
```

Add your configuration values to a `.env` file at the root of your project:

    GITHUB_USERNAME=craicoverflow
    GITHUB_API_KEY=TCtQrZizM1xeo1v92lsVfLOHDsF7TfT5lMvwSno

Then you can use these values in your application:

{% gist ea6d06a2d819c706029e888f1a6a7d28 %}

It’s important to note that if an environment variable is already defined in the
system, then Go will prefer use that instead of the value in `.env`.

---

## Wrapping environment variables in a configuration package

It's all well and good accessing environment variables directly like this, but having to maintain that doesn't seem fun, does it? Every value is a string - and imagine having to update every reference when an environment key is modified!

To deal with this, let’s create a configuration package to access environment variables in a much
more centralized and maintainable way.

Here is a simple `config` package which will return configuration values in a
`Config` struct. We have the option to define a default value, so when an
environment variable does not exist this will be used instead.

{% gist 88a3866f6c06d34d154c963404cdc044 %}

Next, we should add different types to the `Config` struct. The current implementation can only handle `string` types, which isn’t very practical for larger applications.

Let's add functions to handle `bool`, `slice` and `integer` types.

{% gist f487b83a5bae318a7a94ba6d326219c1 %}

Update your `.env` file with these environment variables.

    GITHUB_USERNAME=craicoverflow
    GITHUB_API_KEY=TCtQrZizM1xeo1v92lsVfLOHDsF7TfT5lMvwSno
    MAX_USERS=10
    USER_ROLES=admin,super_admin,guest
    DEBUG_MODE=false

And now you can access these values from the rest of your application:

{% gist 602027502a75e06c531c921fe79daf83 %}

## And there you have it

There are several libraries out there that claim to offer a configuration
“solution” for your Go application. But is it really a solution when it’s just
as easy to make one yourself?

How do you manage configuration in your Go applications?