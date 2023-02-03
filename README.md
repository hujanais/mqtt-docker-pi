## MQTT-Docker setup on RaspberryPi

### Overview

I have a bunch of environmental sensors and in my home and recently added 4 Kaufha PF12 smart plugs. I am only interested in using them to begin monitoring power usage of some big items in the house. In the past, I have always pushed data directly from ESP8266s to my serverless Node running on Vercel. That in turn pushes data to a cloud hosted MongoDB database and an Angular dashboard. [yes, thankfully all that can be done for free].

Ok enough backstory, with the recent addition of the smart plugs and after discussion with my buddy John [#BostonEnginerd](https://bostonenginerd.com/), he suggested that I try out HomeAssistant. Finally this is what I wanted to acheive. Also to have a clean deployable, shareable and isolated solution, I chose to dockerize everything and to run it on any spare Linux box I can find, in my case an old Raspberry-PI3b. You can choose other hardware.

Hope this helps and inspires. Enjoy!

```
 +---------+ 	+----------------------------------------------+
    | Kaufha  | |               RASPBERRY PI-3b                |
    | plugs   | |  +------------------------------------------+|
    +---------+ |  |       Portainer Docker Orchestrator      ||
         ^      |  |               (Optional)                 ||
         |      |  +------------------------------------------+|     +----------------+   +------------------+
         |      |  +----------------+  +--------------------+  |<--->|Hosted MongoDB  |<->|Angular Dashboard |
         +----->|  |  HomeAssistant |  |   Mosquitto-MQTT   |  |     |+ DataAPI       |   |                  |
                |  |                |  |   Broker           |  |     +----------------+   +------------------+
                |  +----------------+  +--------------------+  |
                |                      +--------------------+  |
                |                      |    Node-TS         |  |
                |                      |    Relay Server    |  |
                |                      +--------------------+  |
                +----------------------------------------------+
```

### Install Git [if missing]

```
sudo apt-get update && sudo apt-get upgrade
sudo apt-get install git
git --version [check to see if installed]
```

### Install Docker and Docker-Compose

```
sudo apt-get update && sudo apt-get upgrade
curl -fsSL test.docker.com -o get-docker.sh && sh get-docker.sh
sudo usermod -aG docker pi	[add pi as default user]
docker version / docker run [to test installation]
sudo apt-get install libffi-dev libssl-dev
sudo apt install python3-dev
sudo apt-get install -y python3 python3-pip
sudo pip3 install docker-compose
sudo systemctl enable docker
```

### TLDR

```
git clone XXX my-folder
cd my-folder
### you should get a directory structure like so,
└── mqtt-docker-pi
├── docker-compose.yaml.# the docker-compose file that orchestrates the entire install
├── hass				# An empty folder required for volume mapping for home-assistant
│ └── config
├── mosquitto			# The folder required for volume mapping for mosquitto-mqtt
│ ├── config
│ │ └── mosquitto.conf	# pre-populated configuration file that you can modify
│ ├── data
│ └── log
├── mqtt-node			# the mqtt-node relay server that pushes data to the mongo cloud api
│ ├── ... express node files not shown for brevity
│ ├── Dockerfile
└── README.md

# make sure you cd into the folder that contains the docker-compose.yaml folder
 1. docker-compose -f docker-compose.yaml up -d
 2. docker ps to check for running containers. you should have 4.
```

The portainer service is optional and I added it for completeness because it provides a web dashboard in managing all your docker containers without messing around with the commands. Personally for me, I find it easier to just use command line.

To access portainer : http://your-pi-ip:9000
To access home-assistant: http://your-pi-ip:8123

### Home Assistant

The mqtt-node server is listening specifically to topic = hass-topic.  
The automation.yaml for home-assistant contains the following,

```
- service: mqtt.publish
	data:
	topic: hass-topic
payload_template: "{ \"kwh1\": {{states('sensor.kauf_plug_total_daily_energy')}},\n
\ \"kwh2\": {{states('sensor.kauf_plug_total_daily_energy_2')}},\n \"kwh3\":
{{states('sensor.kauf_plug_total_daily_energy_3')}},\n \"kwh4\": {{states('sensor.kauf_plug_total_daily_energy_4')}}}\n"
```

### Conclusion

Thanks for reading and I hope this helps you our on your home automation journey.

### Some useful Docker commands

If you are not using portainer and want to user command line, here are some useful commands.

1. docker ps -aq | xargs docker stop | xargs docker rm // To stop and delete all docker containers.
2. docker rmi container-id // To delete docker images
3. docker ps // list all running containers
4. docker ps -a // list all running and stopped containers
5. docker logs container-id // useful to look at logs of a container
