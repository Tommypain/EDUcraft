# AGENTS.md — Development Guidelines

1. Keep the architecture simple.
2. Do not create unnecessary folders.
3. Frontend lives in /src.
4. Backend lives in /src-tauri.
5. Frontend uses React + JSX.
6. Backend uses Rust + Tauri.
7. React communicates with Rust through Tauri IPC.
8. Never put native OS logic directly inside React.
9. Keep the application cross-platform.
10. Avoid platform-specific hard-coded paths.
11. Do not introduce unnecessary dependencies.
12. Do not introduce complex architecture before it is needed.
13. Prefer readable code over clever abstractions.
14. Preserve the existing architecture unless there is a clear technical reason to change it.
15. When the project grows, extend the architecture incrementally.
16. Do not reorganize the project just for the sake of organization.
17. Keep Linux, Windows, and macOS support in mind for every native feature.
18. Treat the provided application icon as the source of truth for branding.
19. Never redesign the provided icon unless explicitly instructed.
20. Keep generated icon assets platform-appropriate while preserving the original design.
