import importlib.util
from pathlib import Path
import shutil
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('human_install', ROOT / 'install.py')
installer = importlib.util.module_from_spec(spec)
spec.loader.exec_module(installer)


class InstallTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.base = Path(self.tmp.name)
        self.source = self.base / 'package'
        for name in installer.FILES:
            target = self.source / name
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(ROOT / name, target)
        self.skills = self.base / 'codex' / 'skills'

    def test_fresh_install_and_unrelated_skill(self):
        other = self.skills / 'other' / 'keep.txt'
        other.parent.mkdir(parents=True)
        other.write_text('keep')
        target, backup, changed = installer.install(self.source, self.skills)
        self.assertTrue(changed)
        self.assertIsNone(backup)
        self.assertEqual(other.read_text(), 'keep')
        for name in installer.FILES:
            self.assertEqual((target / name).read_bytes(), (self.source / name).read_bytes())

    def test_repeat_is_noop(self):
        installer.install(self.source, self.skills)
        _, backup, changed = installer.install(self.source, self.skills)
        self.assertFalse(changed)
        self.assertIsNone(backup)

    def test_update_keeps_backup(self):
        target, _, _ = installer.install(self.source, self.skills)
        (target / 'SKILL.md').write_text('user customization')
        _, backup, changed = installer.install(self.source, self.skills)
        self.assertTrue(changed)
        self.assertEqual((backup / 'SKILL.md').read_text(), 'user customization')

    def test_incomplete_source_leaves_existing_install_unchanged(self):
        target, _, _ = installer.install(self.source, self.skills)
        original = (target / 'SKILL.md').read_bytes()
        (self.source / 'references/modes.md').unlink()
        with self.assertRaises(ValueError):
            installer.install(self.source, self.skills)
        self.assertEqual((target / 'SKILL.md').read_bytes(), original)

    def test_failed_activation_restores_backup(self):
        target, _, _ = installer.install(self.source, self.skills)
        (target / 'SKILL.md').write_text('user customization')
        rename = Path.rename

        def fail_stage(path, dest):
            if path.parent.name.startswith('.human-korean-install-'):
                raise OSError('simulated activation failure')
            return rename(path, dest)

        with patch.object(Path, 'rename', fail_stage):
            with self.assertRaises(OSError):
                installer.install(self.source, self.skills)
        self.assertEqual((target / 'SKILL.md').read_text(), 'user customization')


if __name__ == '__main__':
    unittest.main()
