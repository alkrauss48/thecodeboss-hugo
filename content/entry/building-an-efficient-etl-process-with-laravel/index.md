---
title: Building an Efficient ETL Process with Laravel
date: "2021-06-15"
categories:
- Talks
tags:
- Random
draft: "false"
description: Check out my talk "Building an Efficient ETL Process with Laravel," given on 2021-06-15.

videoUrl: https://www.youtube.com/embed/8L416as-eKY
---
Extract-Transform-Load (ETL) processes have been around for a long time in
programming, and they’re not too challenging to understand: you take data from
one or many sources (legacy DB, SAP, third-party data lake, spreadsheets, etc.),
transform it to fit your own application’s workflows, and then load it into
your own data sources. You can use ETL processes for syncing data across
sources, migrating legacy data, aggregating multiple data sources, and more.

As you might expect, ETL processes involve a lot of data, and it’s up to you
to ensure that you’re building a nice, lean ETL process. No one wants an ETL
process that takes hours to run if it’s possible to run it in minutes. In this
live-demo talk, we’ll use Laravel to implement an ETL process where we start
with a functioning yet inefficient scenario and step-by-step turn it into a
lean, mean ETL process. No prior Laravel knowledge is necessary, just an open
mind. We’ll review writing efficient database queries, architecting your code
to avoid common inefficient pitfalls, and more.
