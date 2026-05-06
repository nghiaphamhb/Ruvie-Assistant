# AGENTS.md

## Project Overview

Ruvie Agent is a minimal local RAG application for Markdown knowledge bases.
The repository is split into:

- `backend/`: FastAPI application for ingestion, retrieval, and answer generation.
- `frontend/`: React + Vite client for chat, document upload, and knowledge rebuild flows.

The current product shape is a local knowledge assistant:

- Users upload or ingest Markdown documents.
- Backend indexes documents into Chroma.
- Frontend sends chat questions to the backend and renders assistant responses plus sources.

Do not store secrets, API keys, tokens, passwords, or private credentials in this file.

## Tech Stack

### Backend

- Python
- FastAPI
- Uvicorn
- python-dotenv
- ChromaDB
- FastEmbed
- LangChain community/text splitters/chroma integrations
- OpenAI SDK with OpenRouter-compatible base URL

### Frontend

- React 19
- Vite
- JavaScript JSX, not TypeScript
- CSS in a central `src/index.css`
- `lucide-react` for icons
- ESLint
- Prettier
- Husky + lint-staged for pre-commit checks

### Tooling

- Frontend package manager: `npm`
- Frontend lock file: `frontend/package-lock.json`
- Git hooks: `frontend/.husky`

## Important Directory Structure

```text
backend/
  app/
    api/
    core/
    services/
    main.py
  data/markdown/
  requirements.txt

frontend/
  .husky/
  src/
    api/
    assets/
    components/
      chat/
      documents/
      layout/
    App.jsx
    index.css
    main.jsx
  package.json
  eslint.config.js
  vite.config.js
```

## Important Files And Their Roles

### Root

- `README.md`: main project overview and quick start.
- `.gitignore`: ignore rules for Python, frontend build outputs, env files, logs, and caches.
- `AGENTS.md`: persistent working context for Codex and future contributors.

### Backend

- `backend/app/main.py`: FastAPI app entrypoint.
- `backend/app/api/routes.py`: HTTP endpoints such as health, ask, ingest, upload.
- `backend/app/core/config.py`: environment/config loading.
- `backend/app/core/logging_config.py`: logging setup.
- `backend/app/services/ingest.py`: document ingestion/indexing logic.
- `backend/app/services/retriever.py`: retrieval logic for indexed content.
- `backend/app/services/llm.py`: LLM call orchestration.
- `backend/data/markdown/`: local Markdown knowledge source.
- `backend/requirements.txt`: backend Python dependencies.

### Frontend

- `frontend/package.json`: npm scripts, lint-staged config, frontend dependencies.
- `frontend/eslint.config.js`: ESLint flat config for JS/JSX React code.
- `frontend/.prettierrc`: Prettier formatting rules.
- `frontend/.prettierignore`: files/directories excluded from Prettier formatting.
- `frontend/.husky/pre-commit`: pre-commit hook running lint-staged.
- `frontend/src/main.jsx`: React bootstrap.
- `frontend/src/App.jsx`: top-level app wiring.
- `frontend/src/index.css`: main visual system and global styling.
- `frontend/src/api/ruvieApi.js`: frontend API calls to backend.
- `frontend/src/components/chat/ChatView.jsx`: main chat screen state rendering.
- `frontend/src/components/chat/ChatInput.jsx`: user message input and send behavior.
- `frontend/src/components/chat/MessageList.jsx`: message list rendering.
- `frontend/src/components/chat/MessageBubble.jsx`: individual message UI, assistant actions.
- `frontend/src/components/chat/SourceList.jsx`: retrieved source display.
- `frontend/src/components/documents/UploadPanel.jsx`: upload/rebuild related controls.
- `frontend/src/components/layout/AppShell.jsx`: app layout container.
- `frontend/src/components/layout/Sidebar.jsx`: navigation/history/sidebar actions.

## Coding Style Rules

- Use JavaScript and JSX, not TypeScript, unless the project is explicitly migrated later.
- Keep frontend styling consistent with the current dark/neon visual language.
- Prefer editing existing patterns instead of introducing a second UI system.
- Use semicolons and double quotes in frontend JS/JSX.
- Follow Prettier defaults already configured in `frontend/.prettierrc`.
- Keep indentation at 2 spaces in frontend code.
- Favor small, focused React components.
- Prefer function components and hooks.
- Avoid unnecessary abstraction for simple UI behavior.
- Keep CSS class naming descriptive and aligned with existing patterns.
- Reuse existing API utilities and component structure instead of duplicating logic.
- Add comments only when a block is non-obvious; avoid noisy comments.

## Rules When Codex Edits Code

- Read the current file before making non-trivial edits to avoid overwriting user changes.
- Assume the git worktree may already be dirty; do not revert unrelated user changes.
- Prefer minimal, targeted patches over broad rewrites.
- Preserve the current folder organization:
  - chat UI in `frontend/src/components/chat/`
  - layout UI in `frontend/src/components/layout/`
  - document/upload UI in `frontend/src/components/documents/`
- When changing frontend behavior, check whether `frontend/src/index.css` also needs updates.
- When changing API interaction, inspect both `frontend/src/api/ruvieApi.js` and backend route/service files.
- After meaningful frontend changes, run available checks when practical:
  - `npm run lint`
  - `npm run format`
  - `npm run build`
- After meaningful backend changes, run the smallest relevant verification available.
- Do not put secrets in code, tests, config examples, or this file.
- Do not delete lock files or swap package managers without an explicit reason.

## Git Rules

### Files That Should Usually Be Committed

- Source code under `frontend/src/` and `backend/app/`
- Frontend config files such as:
  - `frontend/package.json`
  - `frontend/package-lock.json`
  - `frontend/eslint.config.js`
  - `frontend/.prettierrc`
  - `frontend/.prettierignore`
  - `frontend/.husky/*`
- Backend dependency/config templates such as:
  - `backend/requirements.txt`
  - `backend/.env-example`
- Documentation files such as `README.md` and `AGENTS.md`

### Files That Must Not Be Committed

- Secrets and local env files:
  - `.env`
  - `.env.local`
  - `.env.*.local`
  - backend/private credentials
- Dependency/install artifacts:
  - `node_modules/`
  - `.venv/`
- Build/cache outputs:
  - `dist/`
  - `build/`
  - `coverage/`
  - `.vite/`
  - `.eslintcache`
  - `__pycache__/`
  - `.pytest_cache/`
- Local database/generated runtime artifacts:
  - `chroma_db/`
- Editor/OS noise:
  - `.DS_Store`
  - `.idea/`
  - `*.log`

### Lock File Rule

- Keep the correct dependency lock file in git.
- This project currently uses `npm` for the frontend, so `frontend/package-lock.json` should be committed.
- Do not ignore or delete the active lock file.

## Operational Notes

- Frontend dev server:
  - `cd frontend`
  - `npm install`
  - `npm run dev`
- Frontend quality checks:
  - `npm run lint`
  - `npm run format`
  - `npm run build`
- Backend dev server:
  - `cd backend`
  - `python -m venv .venv`
  - `.venv\Scripts\activate`
  - `pip install -r requirements.txt`
  - `uvicorn app.main:app --reload`

## Security Reminder

Never write secrets, API keys, tokens, passwords, or private credentials into:

- `AGENTS.md`
- `.env.example`
- source code
- committed config files
- tests
- documentation
