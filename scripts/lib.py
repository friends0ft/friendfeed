import os, sys
from pathlib import Path
from datetime import datetime, timezone, timedelta
from collections import defaultdict
from zoneinfo import ZoneInfo

import tomllib
import tomli_w

#
# Datetimes
#

TZ = ZoneInfo("America/Denver")

#
# Paths
#

_root_dir = None


def root_dir(max_depth=5):
    global _root_dir
    if _root_dir:
        return _root_dir

    cwd = Path(os.path.abspath(sys.argv[0])).parent

    def is_root():
        for child in cwd.iterdir():
            if child.name == "zola.toml":
                return True
        return False

    for _ in range(max_depth):
        if is_root():
            break
        cwd = cwd.parent
    if not is_root():
        raise Exception("unable to find directory: {dir}")

    _root_dir = cwd
    return _root_dir


def relative(path):
    curr = root_dir()
    for path in path.split("/"):
        curr = curr / path
    return curr


def cd(dir):
    cwd = root_dir()
    for dir in dir.split("/"):
        cwd = cwd / dir
    os.chdir(cwd)


#
# Front matter
#

PARSER_KEY = "____FM_PARSER_IGNORE_ME"


def _find_frontmatter(path: str | Path) -> tuple[list[str], tuple[int, int]]:
    started = False
    finished = False
    all_lines = []
    fm_range = [None, None]
    with open(path, "r") as file:
        for i, line in enumerate(file):
            all_lines.append(line)
            if not finished and line.strip() == "+++":
                if not started:
                    started = True
                    fm_range[0] = i + 1
                else:
                    finished = True
                    fm_range[1] = i
    if not finished:
        raise Exception("no front matter found")
    return (all_lines, fm_range)


def parse_frontmatter(path: str | Path):
    all_lines, fm_range = _find_frontmatter(path)
    text = "".join(all_lines[fm_range[0] : fm_range[1]])
    frontmatter = tomllib.loads(text)
    frontmatter[PARSER_KEY] = (all_lines, fm_range)
    return frontmatter


def replace_frontmatter(path: str | Path, frontmatter: dict):
    def meta():
        if meta := frontmatter.pop(PARSER_KEY, None):
            return meta
        return _find_frontmatter(path)

    all_lines, fm_range = meta()
    all_lines[fm_range[0] : fm_range[1]] = [tomli_w.dumps(frontmatter)]
    with open(path, "w") as file:
        file.writelines(all_lines)


def unflatten_frontmatter(d: dict) -> dict:
    out = {}
    for k, v in d.items():
        if k.startswith("_"):
            continue
        parts = k.split(".")
        if len(parts) == 1:
            out[k] = v
            continue
        curr_d = out
        for i, curr_part in enumerate(parts):
            if i < len(parts) - 1:
                if curr_d.get(curr_part) == None:
                    curr_d[curr_part] = {}
                curr_d = curr_d[curr_part]
            else:  # last
                curr_d[curr_part] = v
    return out
