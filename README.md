# Ethergate

[![wakatime](https://wakatime.com/badge/user/13a02f4d-34c9-45f7-95ee-bf9d66b139fb/project/d153a31a-7cb5-4ac0-8c1a-7d650da5b4f9.svg)](https://wakatime.com/badge/user/13a02f4d-34c9-45f7-95ee-bf9d66b139fb/project/d153a31a-7cb5-4ac0-8c1a-7d650da5b4f9)

I have few ideas that "could" work and wanna to try them out when building some real-world like payment bridge for some crypto swap service.

```
cp example.env .env
docker compose -f "local.docker-compose.yml" up -d --build
yarn db:push
yarn dev
```

```
cp example.env .env && docker compose -f "local.docker-compose.yml" up -d --build && yarn db:push && yarn dev
docker compose -f "local.docker-compose.yml" down
```

### Developer Logs

> Sun 4 Sep 2022: Okay, I've lost convention of project and somehow instead payment gateway we have e-commerce platform or something like this crap, I'll keep this for some unknown purposes in future, and probably migrate it to some subdomain responsible for products (I'm supposed to do same with payments so it's really whatever what we have). Currently working on some simple payments to make it work and remove deprecated modules which hold actually working payment service.
