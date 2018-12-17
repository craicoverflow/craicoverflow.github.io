---
title: 'How to enable OpenShift service catalog components using Minishift'
layout: post
categories: guides openshift
comments: true
excerpt: "Learn how to enable OpenShift service catalog components when running Minishift."
tags: [Guides, Linux, MacOS, Windows, OpenShift, Minishift, Administration]
---

**Note: This only works with OpenShift version >= 3.10.x**

There are two ways to enable the default OpenShift service catalog components with the Minishift.

The recommended method is to run the `minishift openshift component add` command when your cluster is already running:

```bash
$ minishift openshift component add service-catalog
$ minishift openshift component add automation-service-broker
$ minishift openshift component add template-service-broker
```

You can also enable components during `minishift start`. This is still one of Minishift's [experimental features](https://github.com/minishift/minishift/blob/master/docs/source/using/experimental-features.adoc) so you need to set the environemnt variable `MINISHIFT_ENABLE_EXPERIMENTAL` in order for it to work.

```bash
$ export MINISHIFT_ENABLE_EXPERIMENTAL=y
```

```bash
$ minishift start --extra-clusterup-flags "--enable=*,service-catalog,automation-service-broker,template-service-broker"
```