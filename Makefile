# Project constants
PROJECT_NAME=omah-to
COMPOSE_DEV_FILE=compose.yml

# Mode selection (default: dev)
MODE ?= dev
ifeq ($(MODE),dev)
	COMPOSE_FILE=$(COMPOSE_DEV_FILE)
	BACKEND_SERVICE=$(PROJECT_NAME)-backend-api-1
	BACKEND_DB=$(PROJECT_NAME)-backend-db-1
else ifeq ($(MODE),prod)
	COMPOSE_FILE=$(COMPOSE_PROD_FILE)
	BACKEND_SERVICE=$(PROJECT_NAME)-backend-api-1
	BACKEND_DB=$(PROJECT_NAME)-backend-db-1
else
$(error MODE must be either 'dev' or 'prod')
endif

DOCKER_COMPOSE=docker compose -f $(COMPOSE_FILE)

# Commands
.PHONY: up down downv restart restartv logs build start stop ps shell db

# Start containers
up:
	$(DOCKER_COMPOSE) up

upb:
	$(DOCKER_COMPOSE) up --build

updb:
	$(DOCKER_COMPOSE) up -d --build

# Stop and remove containers
down:
	$(DOCKER_COMPOSE) down

# Stop and remove containers and volumes
downv:
	$(DOCKER_COMPOSE) down -v

# Restart containers
restart: down upb

# Restart containers with volume removal
restartv: downv upb

# Build containers
build:
	$(DOCKER_COMPOSE) build

# View logs
logs:
	$(DOCKER_COMPOSE) logs -f

# Stop containers
start:
	$(DOCKER_COMPOSE) start

# Stop containers
stop:
	$(DOCKER_COMPOSE) stop

# List all containers
ps:
	$(DOCKER_COMPOSE) ps
