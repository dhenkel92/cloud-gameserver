# Cloud Gameserver

Quite often, you are forced to pay for a server that is always available, even though you don't use it all the time. This leads to either high costs or very underpowered hardware.
So, the basic idea of this project is to connect the pay-as-you-go model of cloud infrastructure with dynamic game servers.

The application will provide a web UI where you can manage different games as well as different instances of one game.
If you want to play, you just start the server, wait for some minutes and stop it again when you are done.
This means that you will only pay for the time where you've been actively playing the game, so a desirably low amount of money.

For example: Hetzner CPX51 (16 CPU's & 32G Memory) costs about 9,5ct for one hour of gameplay.

## General Setup
![General Setup](documents/general_setup.png)

## Components

The application consists of different parts which all have their own task, which I'll describe in the following sections:

### Frontend

The frontend is written in React with Typescript.
It gives the user a visual view of all his configurations and servers.
These include if the server is currently running as well as the server logs and at which port they are reachable.

### Backend

To reduce the complexity and the amount of code, I've decided to use strapi as it provides basic functionality by default.
Strapi has plugins for many different purposes, like User authentication or graphql / rest endpoints.
Furthermore, it's extensible with custom code, which is also used in this project.

In the background, its using a MySQL server to store it's state.
The migrations are also fully managed by strapi, based on diffs between versions.

### Infrastructure

The infrastructure folder includes everything needed to automatically setup the infrastructure.
Right now, only Hetzner cloud is supported.

The infrastructure consists of different tools for different purposes.
Packer is used for prebuilding machine images so that the startup of the instances is faster.
Terraform is used for the automation of infrastructure provisioning. It includes the definition for the admin server as well as the game servers.
The last part is Ansible, which is used for configuration management.

### Async Server Provisioner

This part of the system is basically a queue consumer, which listens for new messages and then starts / stops game servers.
It's written in NodeJS / Typescript and uses a MySQL table as a queuing system.

The exact implementation is described [here](https://github.com/dhenkel92/rds-queuing-system).

### Game Server Watcher

The game server watcher is a side-car that will be deployed on every game server to export important information via an API.
It's written in Rust, and in the current implementation, it's just checking if the server is reachable by checking if the port is open or not.

Nevertheless, in the future, there are plans to also ship logs and other related information that should be shown in the UI.
