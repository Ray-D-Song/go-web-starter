# TEMPALTE

Go + Preact web starter template.

## Rename

Run the rename script once after creating a new project from this template:

```bash
go run ./cmd/rename-template -- "Your App Name" your-app github.com/your-org/your-app
```

Arguments:

- `display-name`: user-facing name shown in the UI and browser title.
- `slug`: package-safe project name. Optional; derived from `display-name` when omitted.
- `go-module`: Go module path. Optional; defaults to `github.com/your-org/<slug>`.

## Build

```bash
make build
```
