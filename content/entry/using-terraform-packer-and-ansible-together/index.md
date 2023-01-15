---
title: Using Terraform, Packer, and Ansible Together
date: "2018-04-20"
categories:
- talks
tags:
- Tools
draft: "false"
description: Check out my talk "Using Terraform, Packer, and Ansible Together," given on 2018-04-11.

videoUrl: https://www.youtube.com/embed/pkEezNSFWtA
---
There's a good chance that you have projects running on a server somewhere.
What happens if that server gets accidentally erased, or if you need to spin
up an identical server? Even if you have backups, you'll still need to spend
precious time setting things back up the way you had them – and there's no
telling if you'll get it exactly right. That's where this powerful dev tooling
combo comes into play. By using Ansible, Packer, and Terraform, you can
automate this entire process, getting as granular as you need to be.

In this talk, we’ll review what Ansible, Packer, and Terraform are
individually, as well as how you can use them together. As a demo, we'll be
automating the creation and deployment of a digital ocean droplet that's
pre-configured to run a fun personal-project website.

Check out the GitHub repo found in this demo here:
https://github.com/alkrauss48/ansible-packer-terraform-demo
