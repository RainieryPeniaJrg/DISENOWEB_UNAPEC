# Rama protegida `main`

Configura en GitHub > Settings > Branches > Branch protection rules:
- Branch name pattern: `main`
- Require a pull request before merging ✓
  - Require approvals: 1+ (recomendado 2 para prod)
  - Dismiss stale approvals on new commits ✓
  - Require review from Code Owners ✓ (si usas CODEOWNERS)
- Require status checks to pass ✓
  - Checks: `backend (.NET API)`, `frontend (Vite React)` (del workflow CI)
  - Require branches to be up to date before merging ✓
- Require signed commits (opcional) ✓
- Include administrators ✓ (recomendado)
- Restrict who can push to matching branches ✓ (nadie, solo merges de PR)

Para hotfix:
- Crear branch `hotfix/<nombre>` desde `main`, abrir PR hacia `main` y pasar CI.

Activa "Automatically delete head branches" en Settings > General para limpiar ramas después de merge.

## Automatizar con GitHub CLI
Usa `scripts/set-branch-protection.ps1` para aplicar la regla sin entrar a la UI.
```powershell
$env:GH_TOKEN = "<token_con_permisos_repo>"
./scripts/set-branch-protection.ps1 -Repo "owner/nombre-repo"
```
El script configura:
- PR obligatorio y aprobaciones (1), invalida approvals con nuevos commits.
- Checks requeridos: `backend (.NET API)` y `frontend (Vite React)`.
- Estrictos: branch up-to-date, sin force push, admin incluido, lineal history, resolver conversaciones.
