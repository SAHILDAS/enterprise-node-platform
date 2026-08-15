.PHONY: install dev build test lint typecheck format clean docker-up docker-down

install:
	pnpm install

dev:
	pnpm dev

build:
	pnpm build

test:
	pnpm test

lint:
	pnpm lint

typecheck:
	pnpm typecheck

format:
	pnpm format

clean:
	pnpm clean

docker-up:
	docker compose up -d

docker-down:
	docker compose down