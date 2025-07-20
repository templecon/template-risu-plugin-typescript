#!/usr/bin/env python
import os
from shutil import copy, copytree
import shutil
import subprocess
from os.path import join
from typing import Any

risuai_repo = "https://github.com/kwaroran/RisuAI"
risuai_repo_branch = "main"
dist = "build/risuai-dts"
temp_dir = "build/risuai"

debug = True
silent = [] if debug else ["--silent"]
quiet = [] if debug else ["--quiet"]


def build_options(options: dict[str, str | Any]):
    return [
        f"--{key}={value}" if isinstance(value, str) else f"--{key}"
        for key, value in options.items()
    ]


# Clone the RisuAI repository if it doesn't exist
if os.path.isdir(join(temp_dir, ".git")):
    print("RisuAI repository already exists. We're gonna update it.")
    subprocess.run(
        ["git", "pull", "origin", risuai_repo_branch] + quiet,
        cwd=temp_dir,
        check=True,
    )
else:
    print("RisuAI repository does not exist. We're gonna create it.")
    os.makedirs(temp_dir, exist_ok=True)

    clone_options = {"depth": "1", "single-branch": True, "branch": risuai_repo_branch}
    subprocess.run(
        ["git", "clone", risuai_repo, temp_dir] + build_options(clone_options) + quiet,
        check=True,
    )

# OK, now we have the RisuAI repository cloned or updated.
# Let's build the typescript files.
print("Installing deps...")
if os.path.exists(join(temp_dir, "node_modules")):
    print("skipped.")
else:
    subprocess.run(
        ["pnpm", "install", "--frozen-lockfile"] + silent,
        cwd=temp_dir,
        check=True,
    )

try:
    # Install it, so we can use it to build types
    # This is a temporary installation, so we'll remove it later.
    if not os.path.exists(join(temp_dir, "node_modules")):
        subprocess.run(
            ["pnpm", "add", "-D", "unplugin-dts@beta", "@microsoft/api-extractor"]
            + silent,
            cwd=temp_dir,
            check=True,
        )
    # Copy the vite.config.ts file
    with open(join("utils", "vite.config.ts"), "r") as f:
        with open(join(temp_dir, "vite.config.ts"), "w") as f2:
            f2.write(f.read().replace(r"{}{}{}dist{}{}{}", dist))

    print("Building types...")
    if os.path.exists(join(temp_dir, "memo.txt")):
        print("Skipping build.")
    else:
        subprocess.run(
            ["pnpm", "build"],
            cwd=temp_dir,
            check=True,
        )
    with open(join(temp_dir, "memo.txt"), "w") as f:  # Indicate that we built the types
        f.write("")

    print("Copying types to the project...")
    src_dir = join(temp_dir, "dist", "src")
    os.makedirs(dist, exist_ok=True)
    copytree(
        src_dir,
        dist,
        dirs_exist_ok=True,
    )
finally:
    # Undo installation of deps and vite.config.ts
    print("Cleaning up...")
    subprocess.run(
        ["git", "checkout", "--", "vite.config.ts"] + quiet,
        cwd=temp_dir,
        check=True,
    )
