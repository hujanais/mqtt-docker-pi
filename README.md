## MQTT-Docker setup on RaspberryPi

https://www.youtube.com/watch?v=Bz2JYxbkmuY&t=1s

### Docker tip

docker ps -aq | xargs docker stop | xargs docker rm

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
docker-compose up -d

```

### Setup eclipse/mosquitto folders

create 3 directories.
/mosquitto/config
/mosquitto/data
/mosquitto/log

Create the mqtt configuration file /config/mosquitto.conf

```
cd /mosquitto/config
sudo nano mosquitto.conf and enter the following

#----- Begin -------
persistence true
persistence_location /mosquitto/data/
log_dest file /mosquitto/log/mosquitto.log

allow_anonymous true
listener 1883
listener 9001
#----- End ------
```

### Install Portainer

1.  sudo docker pull portainer/portainer-ce:latest
2.  mkdir /portainer/portainer_data folder

### Directory check

A quick checkpoint to make sure your directory structure is as follows,

```
your-root
	- docker-compose.yaml
	- mosquitto
		- config
			- mosquitto.conf
		- data
		- log
	- portainer
		- portainer_data
```

### Setup docker-compose for Mosquitto and Portainer

Please note that Portainer is optional and just a docker dashboard for those who would rather deal with docker containers via a web-interface. However for a simple setup with just a few containers, I personally just use the docker commands in terminal.

create docker-compose.yaml

```
services:
##Mosquitto
    mqtt:
        container_name: mosquitto
        image: eclipse-mosquitto
        restart: always
        ports:
            - "1883:1883"
            - "9001:9001"
        volumes:
            - ./mosquitto/config/mosquitto.conf:/mosquitto/config/mosquitto.conf
            - ./mosquitto/data:/mosquitto/data
            - ./mosquitto/log:/mosquitto/log

    portainer:
        container_name: portainer
        image: portainer/portainer-ce:latest
        ports:
            - 9000:9000
        volumes:
            - /portainer/portainer_data:/data
            - /var/run/docker.sock:/var/run/docker.sock
        restart: always
```

### Create the docker container using docker-compose

1.  docker-compose -f docker-compose.yaml up -d
2.  docker ps to check for running container

### Portainer [optional]

1. Now you can access portainer from remote computer via http://pi-ip:9000
2. Initially you will need to set up a new user and password.

### Setup authentication for MQTT Broker [recommended but optional]

1. This step can only be done after your MQTT broker has been setup from the previous steps.
2. On your Pi, docker ps to list the 2 docker containers that are running, one should be the mqtt and one the portainer.
3. Now you will need to interactively shell into the MQTT container to setup the user-password.

```
	docker exec -it mqtt sh
	mosquitto_passwd -c /mosquitto/config/mosquitto.passwd user-id
	exit
	cd /mosquitto/config ⇒ you should have a new file called mosquitto.passwd
	sudo nano mosquitto.conf and update the following

	#----- Begin -------

	persistence true
	persistence_location /mosquitto/data/
	log_dest file /mosquitto/log/mosquitto.log

	# add these new items.
	password_file /mosquitto/config/mosquitto.passwd
	allow_anonymous false
	listener 1883
	listener 9001
	protocol websockets

	#----- End ------
```

4. Now go over to portainer to re-start the MQTT container or just use command line in your Pi

```
# docker restart [containerId/containerName] and in my case
docker restart mqtt
```

### Test the MQTT broker
