#!/usr/bin/env python3
"""Install HUMAN for the current Codex user without external dependencies."""
import argparse
import hashlib
import os
from pathlib import Path
import shutil
import tempfile
import uuid

FILES = (
    'SKILL.md', 'README.md', 'RESEARCH.md', 'agents/openai.yaml',
    'references/modes.md', 'references/examples.md', 'evals/review.md',
)


def digest(path):
    return hashlib.sha256(path.read_bytes()).digest()


def install(source, skills_dir):
    for name in FILES:
        item = source / name
        if not item.is_file() or item.is_symlink():
            raise ValueError('Missing or unsafe package file: ' + name)
    if 'name: human-korean' not in (source / 'SKILL.md').read_text(encoding='utf-8'):
        raise ValueError('Unexpected skill metadata')
    destination = skills_dir / 'human-korean'
    if source.resolve() == destination.resolve():
        raise ValueError('Run the installer from the downloaded package, not its destination')
    if destination.is_dir() and not destination.is_symlink() and all(
        (destination / name).is_file() and not (destination / name).is_symlink()
        and digest(source / name) == digest(destination / name) for name in FILES
    ):
        return destination, None, False
    skills_dir.mkdir(parents=True, exist_ok=True)
    backup = None
    with tempfile.TemporaryDirectory(prefix='.human-korean-install-', dir=skills_dir) as tmp:
        staged = Path(tmp) / 'human-korean'
        for name in FILES:
            target = staged / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source / name, target)
            if digest(target) != digest(source / name):
                raise ValueError('Copy verification failed: ' + name)
        if destination.exists() or destination.is_symlink():
            backups = skills_dir.parent / 'skill-backups'
            backups.mkdir(parents=True, exist_ok=True)
            backup = backups / ('human-korean-' + uuid.uuid4().hex)
            destination.rename(backup)
        try:
            staged.rename(destination)
        except Exception:
            if backup is not None:
                backup.rename(destination)
            raise
    return destination, backup, True


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    default_root = Path(os.environ.get('CODEX_HOME') or (Path.home() / '.codex'))
    parser.add_argument('--skills-dir', type=Path, default=default_root / 'skills')
    args = parser.parse_args()
    destination, backup, changed = install(Path(__file__).resolve().parent, args.skills_dir.expanduser())
    print(('Installed: ' if changed else 'Already installed: ') + str(destination))
    if backup is not None:
        print('Previous version backed up: ' + str(backup))
    print('Start a new Codex session in this environment and invoke $human-korean.')
