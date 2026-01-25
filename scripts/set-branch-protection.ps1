param(
    [Parameter(Mandatory=$true)][string]$Repo  # formato: owner/nombre
)

if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Error "gh CLI no está instalado. Instálalo: https://cli.github.com/"; exit 1
}

if (-not $env:GH_TOKEN) {
    Write-Error "Define GH_TOKEN con permisos 'repo' para poder llamar al API"; exit 1
}

$body = @{ 
    required_status_checks = @{ strict = $true; contexts = @("backend (.NET API)", "frontend (Vite React)") };
    enforce_admins = $true;
    required_pull_request_reviews = @{ dismiss_stale_reviews = $true; required_approving_review_count = 1 };
    restrictions = $null; # nadie puede pushear directo
    required_linear_history = $true;
    allow_force_pushes = $false;
    allow_deletions = $false;
    block_creations = $false;
    required_conversation_resolution = $true;
    lock_branch = $false;
    allow_fork_syncing = $true
} | ConvertTo-Json

Write-Host "Aplicando protección a main en $Repo..."

# Enviar el body por stdin usando gh --input -
$body | gh api `
  -X PUT `
  -H "Accept: application/vnd.github+json" `
  "/repos/$Repo/branches/main/protection" `
  --input -

Write-Host "Listo. Verifica en https://github.com/$Repo/settings/branches"
