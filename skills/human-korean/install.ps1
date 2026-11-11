param([string]$SkillsDir)

$ErrorActionPreference = 'Stop'
$sourceDir = $PSScriptRoot
if (-not $SkillsDir) {
    $codexDir = if ($env:CODEX_HOME) { $env:CODEX_HOME } else { Join-Path $env:USERPROFILE '.codex' }
    $SkillsDir = Join-Path $codexDir 'skills'
}
$files = @(
    'SKILL.md', 'README.md', 'RESEARCH.md', 'agents/openai.yaml',
    'references/modes.md', 'references/examples.md', 'evals/review.md'
)
foreach ($relative in $files) {
    $sourceFile = Join-Path $sourceDir $relative
    if (-not (Test-Path -LiteralPath $sourceFile -PathType Leaf)) {
        throw "Missing package file: $relative"
    }
    if ((Get-Item -LiteralPath $sourceFile).Attributes -band [IO.FileAttributes]::ReparsePoint) {
        throw "Linked package files are not supported: $relative"
    }
}
$metadata = Get-Content -LiteralPath (Join-Path $sourceDir 'SKILL.md') -Raw -Encoding UTF8
if ($metadata -notmatch '(?m)^name: human-korean\s*$') { throw 'Unexpected skill metadata' }
$destination = Join-Path $SkillsDir 'human-korean'
if ([IO.Path]::GetFullPath($sourceDir) -eq [IO.Path]::GetFullPath($destination)) {
    throw 'Run the installer from the downloaded package, not its destination'
}
$same = Test-Path -LiteralPath $destination -PathType Container
if ($same) {
    $same = -not ((Get-Item -LiteralPath $destination).Attributes -band [IO.FileAttributes]::ReparsePoint)
}
foreach ($relative in $files) {
    $target = Join-Path $destination $relative
    if (-not $same) { break }
    if (-not (Test-Path -LiteralPath $target -PathType Leaf)) { $same = $false; break }
    if ((Get-Item -LiteralPath $target).Attributes -band [IO.FileAttributes]::ReparsePoint) { $same = $false; break }
    $same = (Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -eq (Get-FileHash -LiteralPath (Join-Path $sourceDir $relative) -Algorithm SHA256).Hash
}
if ($same) {
    Write-Output "Already installed: $destination"
    Write-Output 'Start a new Codex session and invoke $human-korean.'
    exit 0
}
New-Item -ItemType Directory -Path $SkillsDir -Force | Out-Null
$stage = Join-Path $SkillsDir ('.human-korean-install-' + [Guid]::NewGuid().ToString('N'))
$backup = $null
try {
    New-Item -ItemType Directory -Path $stage | Out-Null
    foreach ($relative in $files) {
        $target = Join-Path $stage $relative
        New-Item -ItemType Directory -Path (Split-Path -Parent $target) -Force | Out-Null
        Copy-Item -LiteralPath (Join-Path $sourceDir $relative) -Destination $target
        if ((Get-FileHash -LiteralPath $target -Algorithm SHA256).Hash -ne (Get-FileHash -LiteralPath (Join-Path $sourceDir $relative) -Algorithm SHA256).Hash) {
            throw "Copy verification failed: $relative"
        }
    }
    if (Test-Path -LiteralPath $destination) {
        $backupRoot = Join-Path (Split-Path -Parent $SkillsDir) 'skill-backups'
        New-Item -ItemType Directory -Path $backupRoot -Force | Out-Null
        $backup = Join-Path $backupRoot ('human-korean-' + [Guid]::NewGuid().ToString('N'))
        Move-Item -LiteralPath $destination -Destination $backup
    }
    try {
        Move-Item -LiteralPath $stage -Destination $destination
    } catch {
        if ($backup) { Move-Item -LiteralPath $backup -Destination $destination }
        throw
    }
    Write-Output "Installed: $destination"
    if ($backup) { Write-Output "Previous version backed up: $backup" }
    Write-Output 'Start a new Codex session and invoke $human-korean.'
} finally {
    if (Test-Path -LiteralPath $stage) { Remove-Item -LiteralPath $stage -Recurse -Force }
}
