---
title: 'How to enable OpenShift service catalog components in Minishift'
layout: post
categories: guides openshift
date: 2018-12-17
author: EndaPhelan
summary: "Learn how to enable OpenShift service catalog components in Minishift."
tags:
  - OpenShift
  - Minishift
---

_Note: This only works with OpenShift version >= 3.10.x_

There are two ways to enable OpenShift service catalog components in Minishift.

The recommended method is to run the `minishift openshift component add` command when your cluster is already running:

```bash
$ minishift openshift component add service-catalog
$ minishift openshift component add automation-service-broker
$ minishift openshift component add template-service-broker
```

You can also enable components during `minishift start`. This is still one of Minishift's [experimental features](https://github.com/minishift/minishift/blob/master/docs/source/using/experimental-features.adoc), so you wll need to set the environment variable `MINISHIFT_ENABLE_EXPERIMENTAL` in order for it to work:

```bash
$ export MINISHIFT_ENABLE_EXPERIMENTAL=y
```

Then run `minishift start` with extra flags to enable catalog components:

```bash
$ minishift start --extra-clusterup-flags "--enable=*,service-catalog,automation-service-broker,template-service-broker"
```