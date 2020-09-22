---
title: "Invoking the Kubernetes API in Node.js"
layout: post
date: 2019-07-31
categories: guides kubernetes
blog: true
image: https://i.imgur.com/0jp2rVR.jpg
author: EndaPhelan
description: "An in-depth tutorial on how to invoke the Kubernetes API from a Node.js application"
summary: "An in-depth tutorial on how to invoke the Kubernetes API from a Node.js application"
tags: 
  - Kubernetes
  - Node.js
  - Node
  - JavaScript
---

![](.imgur.com/0jp2rVR.jpg)

Life becomes just a little bit easier if you can invoke the Kubernetes API directly. That's why [GoDaddy](https://www.godaddy.com/) decided to make [kubernetes-client](https://github.com/godaddy/kubernetes-client), an easy to use Node.js client for Kubernetes.

It is [listed](https://kubernetes.io/docs/reference/using-api/client-libraries/) as the officially supported Kubernetes client library for JavaScript. This is significant as it is has the backing of [Kubernetes SIG API Machinery](https://github.com/kubernetes/community/tree/master/sig-api-machinery), which means it is kept up to date with changes to the Kubernetes API specification. It also means that your support requests and issues are much more likely to get a timely response.

## Installing

Install with npm:

```sh
npm install kubernetes-client --save
```

## Configuring

kubernetes-client generates a Kubernetes API client at runtime based on a Swagger/OpenAPI definition.

kubernetes-client will configure itself automatically by first trying to load configuration from the `KUBECONFIG` environment variable, then in `~/.kube/config`. If it hasn't found anything yet it will then try to use an in-cluster service account, and eventually settle on a default proxy configuration as a last resort.

A simple configuration:

```js
const { Client, KubeConfig } = require('kubernetes-client');
const Request = require('kubernetes-client/backends/request');

async function initKubeClient() {
  const kubeconfig = new KubeConfig();

  if (process.env.NODE_ENV === 'production') {
    kubeconfig.loadFromCluster();
  } else {
    kubeconfig.loadFromDefault();
  }

  const backend = new Request({ kubeconfig });
  const kubeclient = new Client({ backend });

  await kubeclient.loadSpec();

  return kubeclient;
}
```

## Using

kubernetes-client maps path item objects to object chains ending in HTTP methods. So for example, `api/v1/namespaces/myproject/configmaps` maps to to `.api.v1.namespaces('myproject').configmaps`. This mapping logic can be used for all resources types.

You can refer to the [Kubernetes API documentation](https://kubernetes.io/docs/home/) to find the API endpoint for a particular resource.

## Deployments

Let's learn how to interact with [Deployments](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.13/#deployment-v1-apps). I picked Deployments as an example as they are commonly used, and the same logic can be applied to all other resources.

### Creating a deployment

You can create a deployment by making a `POST` request to the Kubernetes API.

```js
const deploymentManifest = require('./nginx-deployment.json');

const createdDeployment = await kubeclient.apis.apps.v1.namespaces(namespace).deployments.post({ body: deploymentManifest });
  
console.log('NGINX Deployment created:', createdDeployment);
```

You can also verify that the deployment was created using `kubectl`.

```sh
$ kubectl get deployments
NAME               DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   1         1         1            0           1m
```

### Modifying a deployment

To modify part of a resource you can send a `PATCH` request.

```js
const labels = {
  metadata: {
    labels: {
      environment: 'DEVELOPMENT'
    }
  }
};

const modified = await kubeclient.apis.apps.v1.namespaces(namespace).deployments(deploymentManifest.metadata.name).patch({ body: labels });

console.log('Deployment modified:', modified.body.metadata);
```

### Updating a deployment

By making a `PUT` request you can replace the entire resource.

```js
const updated = await kubeclient.apis.apps.v1.namespaces(namespace).deployments(deploymentManifest.metadata.name).put({ body: deploymentManifest });

console.log('Deployment updated:', updated);
```

### Fetching deployment(s)

Getting all deployments in a namespace.

```js
const deployment = await kubeclient.apis.apps.v1.namespaces(namespace).deployments(deploymentManifest.metadata.name).get();

console.log('Deployment:', deployment);
```

Fetching a single deployment by in a namespace.

```js
const deployments = await kubeclient.apis.apps.v1.namespaces(namespace).deployments.get();

console.log('Deployments:', deployments);
```

Getting all deployments in all namespaces.

```js
const deployments = await kubeclient.apis.apps.v1.deployments.get();

console.log('Deployments (all namespaces):', deployments);
```

You can optionally specify a query string object `qs` to GET requests. For example, to filter on [label selector](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/).

```js
const deployments = await kubeclient.apis.apps.v1.namespaces(namespace).deployments.get({ qs: { labelSelector: 'app=nginx'}});

console.log(deployments);
```

You can use the Kubernetes API documentation to see what other query parameters are available for a resource.

### Deleting a deployment

Deployments can be deleted with `DELETE`.

```js
const removed = await kubeclient.apis.apps.v1.namespaces(namespace).deployments(deploymentManifest.metadata.name).delete();

console.log('Deployment deleted:', removed);
```

## Custom Resources

With kubernetes-client it is possible to extend the Kubernetes API with a CustomResourceDefinition.

In this example, I am creating a CustomResourceDefinition for GitHub accounts.

**githubaccount-crd.json**

```json
{
  "kind": "CustomResourceDefinition",
  "spec": {
    "scope": "Namespaced",
    "version": "v1",
    "versions": [{
      "name": "v1",
      "served": true,
      "storage": true
    }],
    "group": "craicoverflow.github.io",
    "names": {
      "shortNames": [
        "ga"
      ],
      "kind": "GitHubAccount",
      "plural": "githubaccounts",
      "singular": "githubaccount"
    }
  },
  "apiVersion": "apiextensions.k8s.io/v1beta1",
  "metadata": {
    "name": "githubaccounts.craicoverflow.github.io"
  }
}
```

### Creating a CustomResourceDefinition

```js
const crd = require('./githubaccount-crd.json');

const createCRD = await kubeclient.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions.post({ body: crd });

console.log('CustomResourceDefinition created:', createCRD);
```

You then need to add the endpoints for the new CustomResourceDefinition to `kubeclient`.

```js
kubeclient.addCustomResourceDefinition(crd);
```

### Creating a custom resource

Now that we have created the `GitHubAccount` CRD, we will be able to create a `GitHubAccount` custom resource.

**githubaccount-cr.json**

```json
{
    "apiVersion": "craicoverflow.github.io/v1",
    "kind": "GitHubAccount",
    "metadata": {
        "name": "craicoverflow"
    },
    "spec": {
        "login": "craicoverflow",
        "blog": "https://endaphelan.me",
        "bio": "// TODO: Add a bio",
        "type": "User",
        "public_repos": "52"
    }
}
```

```js
const customResource = require('./githubaccount-crd.json');

const createdAccount = await kubeclient.apis[crd.spec.group].v1.namespaces(namespace).githubaccounts.post({ body: customResource });

console.log('Created GitHubAccount:', createdAccount);
```

### Fetching custom resource(s)

Fetching a GitHubAccount custom resource.

```js
const githubAccount = await kubeclient.apis[crd.spec.group].v1.namespaces(namespace).githubaccounts(customResource.metadata.name).get();

console.log('GitHubAccount:', githubAccount);
```

Fetching all GitHubAccount custom resources in a namespace.

```js
const allAccounts = await kubeclient.apis[crd.spec.group].v1.namespaces(namespace).githubaccounts.get();

console.log('GitHubAccountList:', allAccounts);
```

### Deleting a custom resource

```js
const deleteAccounts = await kubeclient.apis[crd.spec.group].v1.namespaces(namespace).githubaccounts(customResource.metadata.name).delete();

console.log('Deleted GitHubAccount:', deleteAccounts);
```

### Deleting a CustomResourceDefinition

```js
const deletedCRD = await kubeclient.apis['apiextensions.k8s.io'].v1beta1.customresourcedefinitions(crd.metadata.name).delete();

console.log('GitHubAccount CRD deleted:', deletedCRD);
```

## Error handling

kubernetes-client outputs a HTTP error when a request fails. The following example emulates `kubectl apply`, by handling a `409 Conflict` error when creating a deployment, and replacing the resource instead.

```js
try {
  const createdDeployment = await kubeclient.apis.apps.v1.namespaces(namespace).deployments.post({ body: deploymentManifest });
  
  console.log('Deployment created:', createdDeployment);
} catch (err) {
  
  if (err.statusCode === 409) {
    const updatedDeployment = await kubeclient.apis.apps.v1.namespaces(namespace).deployments(deploymentManifest.metadata.name).put({ body: deploymentManifest });

    console.log('Updated updated:', updatedDeployment);
  }
}
```

## Watching resources

You can use watch endpoints to stream events from resources. Common event types are `ADDED`, `MODIFIED`, `DELETED`, which signal a new or changed resource at that endpoint.

### Watching deployments

```js
const deploymentStream = await kubeclient.apis.apps.v1.watch.namespaces(namespace).deployments.getObjectStream();

deploymentStream.on('data', event => {
  if (event.type === 'ADDED') {
    console.log('Deployment created:', event.body);
  }
});
```

### Watching custom resources

```js
const githubAccountStream = await kubeclient.apis[crd.spec.group].v1.watch.namespaces(namespace).githubaccounts.getObjectStream();

githubAccountStream.on('data', event => {
  if (event.type === 'CLOSED') {
    console.log('GitHub account deleted:', event);
  }
});
```

To see the `watch` in action, create or update a GitHubAccount custom resource from your terminal and you will see the event stream output a new event in your Node.js application.

```sh
cat <<EOF | kubectl apply -n myproject -f -
apiVersion: craicoverflow.github.io/v1
kind: GitHubAccount
metadata:
  name: testuser
spec:
  bio: ''
  blog: https://example.com
  login: testuser
  public_repos: "100"
  type: User
EOF
```

## Additional Resources

* [godaddy/kubernetes-client](https://github.com/godaddy/kubernetes-client) - the documentation for this library is brilliant. On top of that, there are lots of great [examples](https://github.com/godaddy/kubernetes-client/tree/master/examples).
* [craicoverflow/kubernetes-client-nodejs-example](https://github.com/craicoverflow/kubernetes-client-nodejs-example) - a sample project containing all of the code from this guide.
* [Kubernetes Documentation](https://kubernetes.io/docs/home/) - the official documentation for Kubernetes.
