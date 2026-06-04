.PHONY: help build server-build run run-prod test clean deps fmt web-install web-dev web-build web-clean build-all dev

# Variables
BINARY_NAME=server
GO_MODULE=github.com/your-org/tempalte
CMD_DIR=./cmd/server
WEB_DIR=./web
STATIC_DIR=./app/infra/static/web-dist
BUILD_DIR=./build

# Colors for output
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

help: ## Display this help message
	@echo "$(GREEN)Available targets:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

# Go commands
server-build: ## Build the Go server binary
	@echo "$(GREEN)Building server...$(NC)"
	@mkdir -p $(BUILD_DIR)
	@go build -ldflags="-s -w" -o $(BUILD_DIR)/$(BINARY_NAME) $(CMD_DIR)
	@echo "$(GREEN)Build complete: $(BUILD_DIR)/$(BINARY_NAME)$(NC)"
	@ls -lh $(BUILD_DIR)/$(BINARY_NAME)

run: ## Run the Go server in development mode
	@echo "$(GREEN)Running server in development mode...$(NC)"
	@DEBUG=true go run $(CMD_DIR)/main.go

run-prod: server-build ## Run the built server in production mode
	@echo "$(GREEN)Running server in production mode...$(NC)"
	@DEBUG=false ENV=production $(BUILD_DIR)/$(BINARY_NAME)

test: ## Run Go tests
	@echo "$(GREEN)Running tests...$(NC)"
	@go test -v ./...

fmt: ## Format Go code
	@echo "$(GREEN)Formatting Go code...$(NC)"
	@go fmt ./...
	@echo "$(GREEN)Done!$(NC)"

deps: ## Download Go dependencies
	@echo "$(GREEN)Downloading dependencies...$(NC)"
	@go mod download
	@go mod tidy
	@echo "$(GREEN)Done!$(NC)"

clean: ## Clean build artifacts
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	@rm -rf $(BUILD_DIR)
	@echo "$(GREEN)Done!$(NC)"

# Web commands
web-install: ## Install web dependencies using bun
	@echo "$(GREEN)Installing web dependencies...$(NC)"
	@cd $(WEB_DIR) && bun install
	@echo "$(GREEN)Done!$(NC)"

web-dev: ## Run web development server
	@echo "$(GREEN)Starting web development server...$(NC)"
	@cd $(WEB_DIR) && bun run dev

web-build: ## Build web for production
	@echo "$(GREEN)Building web...$(NC)"
	@cd $(WEB_DIR) && bun run build
	@echo "$(GREEN)Web build complete!$(NC)"
	@ls -lh $(STATIC_DIR)

web-clean: ## Clean web build artifacts
	@echo "$(GREEN)Cleaning web artifacts...$(NC)"
	@rm -rf $(WEB_DIR)/dist
	@echo "$(GREEN)Done!$(NC)"

web-lint: ## Lint web code
	@echo "$(GREEN)Linting web code...$(NC)"
	@cd $(WEB_DIR) && bun run lint

web-type-check: ## Type check web code
	@echo "$(GREEN)Type checking web code...$(NC)"
	@cd $(WEB_DIR) && bun run type:check

web-check-i18n: ## Check i18n translations
	@echo "$(GREEN)Checking i18n...$(NC)"
	@cd $(WEB_DIR) && bun run check:i18n

# Integrated commands
build: web-build server-build ## Build web first, then build the Go server
	@echo "$(GREEN)Full build complete!$(NC)"

build-all: build ## Alias for build

dev: ## Run both web and server in development mode (requires separate terminals)
	@echo "$(YELLOW)Note: This will run both servers. Press Ctrl+C to stop both.$(NC)"
	@echo "$(GREEN)Starting development servers...$(NC)"
	@trap 'kill 0' EXIT; \
	(cd $(WEB_DIR) && bun run dev) & \
	go run $(CMD_DIR)/main.go

install: deps web-install ## Install all dependencies (Go + Web)
	@echo "$(GREEN)All dependencies installed!$(NC)"

clean-all: clean web-clean ## Clean all build artifacts
	@echo "$(GREEN)All artifacts cleaned!$(NC)"
