---
title: Installing the Docker Client CLI on 32-bit Windows
date: "2016-04-01"
categories:
- Blog
tags:
- Devops
draft: "false"
---
If you’re unfamiliar with it, [Docker](https://www.docker.com/) is one of the newer development tools on the scene which takes the power of virtual machines to the next level through a process known as _containerization_. [Containerization](http://diginomica.com/2014/07/02/virtualization-dead-long-live-containerization/) means instead of having a separate entire operating system behind each series of processes – as is the case with a virtual machine – each process should get its own lightweight and flexible container to run inside of. The containers all sit on top of the host’s own OS, so they take up significantly less space and processing power.

To use Docker, you need both a server running somewhere and a client to connect to that server. As of the writing of this article, Docker has always claimed to only run on a 64-bit processor, and that’s true – but only for the server. You can still run the Docker client CLI on a 32-bit OS, but it’s much more difficult to install than on a 64-bit OS. Difficult doesn’t mean impossible though, and I wanted to share how I got the Docker CLI running on my little 32-bit Windows 10 laptop.

Installing on 64-bit vs 32-bit
------------------------------

The go-to way to install the current version of Docker (which at this time is v1.9) on a Windows OS is through the [Docker Toolbox](https://www.docker.com/docker-toolbox). This is a very handy package which installs both the Docker server and client components. But wait – remember how I said that the server can’t run on a 32-bit OS? That’s absolutely true, and for that very reason, the Docker Toolbox .exe file that gets downloaded is unable to run on a 32-bit Windows OS. You can’t get either the server _or_ the client this way. Bummer.

How to Install the Docker Client
--------------------------------

So are we out of luck? Well, that would be a pretty poor ending to this post, so I’m here to ease your nerves. It is possible to install the Docker client on 32-bit Windows – it’s just more difficult than downloading a simple installer file (and more fun). To install the Docker client, we’re going to manually install it through [Chocolatey](https://chocolatey.org/) – a package manager for Windows. If you don’t have Chocolatey installed, you’ll need to open either an **administrative** command prompt session or an **administrative** PowerShell session.

To install Chocolatey through administrative command prompt, run this command:

{{< highlight powerShell "linenos=table" >}}
@powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin
{{< / highlight >}}

To install it through an administrative PowerShell session, run:

{{< highlight powerShell "linenos=table" >}}
iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))
{{< / highlight >}}

Perfect. After running either of these commands, you’ll have access to Chocolatey both in PowerShell and through the command prompt. You can select either of them to use as you continue through this post. We now need to use Chocolatey to install the docker client – which is actually pretty simple:

{{< highlight shell "linenos=table" >}}
choco install docker
{{< / highlight >}}

And that’s it! You should now have access to all the normal Docker shell commands. If you don’t, then try closing out of your session and reopening it. **Note:** I was unable to install the Docker client through OneGet, which I thought was strange. [OneGet](https://github.com/OneGet/oneget) is a manager of package managers, so to speak, so installing a package through OneGet will fire the Chocolatey install command – or a different package manager if you’re not installing a Chocolatey package. This should have worked just like the normal “choco install” command did, but it didn’t. I had to actually use Chocolatey to install it. No big deal, but I wanted to make sure I mentioned that.

If you run the following command, you should see the full list of commands you can run with your Docker client:

{{< highlight shell "linenos=table" >}}
docker
{{< / highlight >}}

You can run the **version** command to see your current client’s version – but that’s about it. Why don’t any of the other commands work? It’s because we’re not linking our client up with a Docker server, which is where all of our container and image data will actually be stored. We can’t run the server on our current 32-bit Windows OS, so we’ll have to get it running somewhere remotely, and then link the connection in our client.

Running the Docker Server Remotely
----------------------------------

There are tons of different ways that you can get the Docker server running remotely, and Docker itself makes this really easy by providing support for [several drivers](https://docs.docker.com/machine/drivers/) to run the server, such as AWS, Digital Ocean, VirtualBox, and many more. You can even create a 64-bit virtual Linux machine inside of your 32-bit Windows OS and install and run the Docker server on there; as long as both your Windows OS and the Linux OS are connected to the same network, then they can connect with each other.

Personally, I went the AWS route, and I want to show you how easy that is. Using the AWS driver to run the Docker server will create an EC2 instance under your account that installs and runs the Docker server; it’s also 100% secure, because it blocks every single port from being accessed except for the one that the server uses to establish its TCP connections to the clients. Now to start the Docker server using the AWS driver, you **will** need access to the **docker-machine** command, which you can’t get on 32-bit Windows. You’ll need either a 64-bit Mac, Linux, or Windows OS to get access to that command. It’s a pain, I know – but think about it this way: ideally, you’re not even supposed to be using a 32-bit machine with Docker at all, so everything we’re doing here is “beating the system.” That’s why we have to work for it.

On your **other machine** that has the docker-machine command working, run the following command:

{{< highlight shell "linenos=table" >}}
# Non-32-bit-Windows OS
 
docker-machine create --driver amazonec2 --amazonec2-access-key AKI******* --amazonec2-secret-key 8T93C********* --amazonec2-vpc-id vpc-****** aws-docker
{{< / highlight >}}

There are 3 required options there – all of which you can read about on the [AWS driver](https://docs.docker.com/machine/drivers/aws/) info page. Suffice it to say that they’re just used to authenticate you with your AWS account. Literally, after running this command with valid keys passed in, you’ll see Docker starting to install on the newly created EC2 instance, and soon it will be running. You can now run the following command on your non-32-bit-Windows OS to view the connection info of this Docker server:

{{< highlight shell "linenos=table" >}}
# Non-32-bit-Windows OS
 
docker-machine env aws-docker
{{< / highlight >}}

Copying the Keys and Certificates
---------------------------------

To connect your client to the Docker server, you need to generate keys and certs that handle authenticating your client both for TLS and SSH. This is an easy process if you have access to the Docker server via CLI – but we don’t. We only have access to the client, which makes this more difficult.

This would normally be one of those moments where we’re just out of luck, but there’s a fix for this that I worked my way through with some reverse-engineering. To set up the Docker server, we needed access to a non-32-bit-Windows OS, and when we set up the server, Docker automatically generated the necessary keys and certs to establish a connection. To find out where our Docker client stored these keys and certs, we run our environment command again for our particular docker machine (using the same one as defined above):

{{< highlight shell "linenos=table" >}}
# Non-32-bit-Windows OS
 
> docker-machine env aws-docker
 
# Which returns...
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://57.32.167.193:2376"
export DOCKER_CERT_PATH="/Users/aaronkrauss/.docker/machine/machines/aws-docker"
export DOCKER_MACHINE_NAME="aws-docker"
# Run this command to configure your shell:
# eval $(docker-machine env aws-docker)
{{< / highlight >}}

We’ll be referring back to all of these environment variables later in the post, but for now we specifically want to look at the DOCKER\_CERT\_PATH variable. This is the path through which Docker grabs the necessary certs and keys to connect to the aws-docker instance. Here’s what my reverse-engineering uncovered: if you copy that folder that’s listed in that variable onto your 32-bit Windows OS, and properly set the corresponding environment variable on that OS too, then your Docker client will successfully use that to authenticate with the server. This is how you get around needing to access the server to get your keys and certs.

So, zip up that folder, email/dropbox/sharefile/whatever it over to your 32-bit Windows OS, and put it somewhere. It doesn’t have to match that exact file path, but you can get close by putting the .docker folder in your HOME directory. Now, everything’s in place; we just need to set up the environment variables and we’ll be good to go.

Adding the Environment Variables
--------------------------------

To know where the Docker server is running, as well as its name and a few other config options, Docker looks to environment variables that are defined through your CLI. I prefer to do this through PowerShell on Windows, so that’s what my following examples will be using. To see all of your current environment variables, enter the following command:

{{< highlight powershell "linenos=table" >}}
Get-ChildItem env:
{{< / highlight >}}

Specifically, we need to set 4 environment variables that Docker uses, and they’re the 4 listed above in the previous section. Here’s an example of what they should look like:

{{< highlight shell "linenos=table" >}}
DOCKER_TLS_VERIFY="1"
DOCKER_HOST="tcp://57.32.167.193:2376"
DOCKER_CERT_PATH="C:\Users\alkra\.docker\machine\machines\aws-docker"
DOCKER_MACHINE_NAME="aws-docker"
{{< / highlight >}}

Your specific Docker variables, such as host, path, and name, will be different – so keep that in mind. Use the same environment variables that your non-32-bit-Windows OS showed. We need to set each of these variables manually, just as is shown here, and to do that we run:

{{< highlight powershell "linenos=table" >}}
$env:DOCKER_MACHINE_NAME="aws-docker"
{{< / highlight >}}

You should be able to see how you would substitute the variable name and value for each of the 4 variables we need to set. After you do this, if everything was set up properly, you should have a fully-functioning Docker client that is communicating with your remote Docker server. You can test it by running:

{{< highlight powershell "linenos=table" >}}
> docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                           NAMES
{{< / highlight >}}

This shows that there are 0 containers running on your server, so start one up!

Final Thoughts
--------------

Docker’s pretty serious about not wanting you to install the software on non-64-bit machines, which you can see by all the hoops we had to jump through to get it working. Even with it working, let’s say that we want to restart our server instance, create a new one, or regenerate certs and keys. We can’t do that, because we don’t have access to the server from this machine. We strictly can only do things that the client can handle, such as managing images and containers, building new containers from a Dockerfile, attaching to running containers, etc. On top of that, if our Docker server ever does regenerate certs or change URLs, or if we need to link up to a new server instance, it’s a pretty big pain to do that.

So, in the end, going through this process may not be worth it to you, but if you have a 32-bit Windows OS lying around and you want to experience the power of Docker containers on that bad boy – then I hope this guide has helped you a little bit.
