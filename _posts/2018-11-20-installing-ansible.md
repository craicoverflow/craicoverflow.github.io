---
title: 'Installing Ansible'
layout: post
categories: guides ansible
blog: true
summary: "Learn how to install Ansible on your Linux or MacOS operating system and use virtualenv to install multiple versions at the same time."
tag:
  - Programming
  - Guides
  - Linux
  - MacOS
  - virtualenv
  - pip
  - Python
  - Ansible
  - Fedora
  - RHEL
  - Ubuntu
  - Debian
---

Ansible is compatible with any machine running Linux or MacOS (sorry Windows users!). Before proceeding with this guide it is a requirement that you have Python 2 (version 2.7+) or Python 3 (version 3.5+) installed.

The simplest way to install Ansible is by using the default package manager for your operating system.

## Fedora

```bash
$ sudo dnf install ansible
```

## RHEL/CentOS

```bash
$ sudo yum install ansible
```

## Ubuntu

Add the PPA to your system:

```bash
$ sudo apt-get install software-properties-common
$ sudo apt-add-repository --yes --update ppa:ansible/ansible
```

Install Ansible:

```bash
$ sudo apt-get install ansible
```

## Debian

Add the PPA to your system:

```bash
$ echo "deb http://ppa.launchpad.net/ansible/ansible/ubuntu trusty main" >> /etc/apt/sources.list
```

Now add the PPA to a list of trusted sources and update the system:

```bash
$ sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 93C4A3FD7BB9C367
$ sudo apt-get update
```

Install Ansible:

```bash
$ sudo apt-get install ansible
```

## MacOS

See [Installing with pip](#installing-with-pip) below for instructions on how to install Ansible on MacOS.

## Arch Linux

```bash
$ sudo pacman -S ansible
```

## Installing with pip

`pip` is Python's package manager. We will need to install in order to use it.

### MacOS

```bash
$ sudo easy_install pip
```

### Fedora

#### Python 2.x

```bash
$ sudo dnf upgrade python-setuptools
$ sudo dnf install python-pip python-wheel
```

#### Python 3.x

```bash
$ sudo dnf install python3 python3-wheel
```

### RHEL/CentOS

#### Python 2.x

```bash
$ sudo yum upgrade python-setuptools
$ sudo yum install python-pip python-wheel
```

#### Python 3.x

```bash
sudo yum install python3 python3-wheel
```

### Ubuntu

#### Python 2.x

```bash
$ sudo apt-get install python-pip
```

#### Python 3.x

```bash
$ sudo apt-get install python3-pip
```

### Arch Linux

#### Python 2.x

```bash
$ sudo pacman -S python2-pip
```

#### Python 3.x

```bash
$ sudo pacman -S python-pip
```

Once `pip` is installed you can install Ansible:

```bash
$ pip install ansible --user
```

## Installing a Specific Version of Ansible

If you are installing the latest version of Ansible then it is recommended to use the default package manager for your operating system.

Sometimes we need to install older versions. For this we can also use `pip`:

```bash
$ pip install ansible==2.6 --user
```

## Installing Multiple Versions

We can use `virtualenv` to create and manage multiple isolated Python environments. This can be installed using `pip`:

```bash
$ pip install virtualenv --user
```

Creating a virtual environment for Ansible 2.6:

```bash
$ virtualenv ansible2.6
```

Activate the `ansible2.6` environment:

```bash
$ source ansible2.6/bin/activate
```

Now install  Ansible 2.6 in the virtual environment:

```bash
$ pip install ansible==2.6
```

To deactivate an environment just run `deactivate`:

```bash
$ deactivate
```

We can repeat the steps above to create another virtual environment for Ansible 2.7:

```bash
$ virtualenv ansible2.7
$ source ansible2.7/bin/activate
$ pip install ansible==2.7
```