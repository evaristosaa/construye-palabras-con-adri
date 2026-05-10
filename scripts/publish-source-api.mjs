import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const repo = "construye-palabras-con-adri";
const branch = "main";
const ignored = new Set(["node_modules", "dist", ".git"]);

function runGh(args, input) {
  return execFileSync("gh", args, {
    encoding: "utf8",
    input,
    stdio: input ? ["pipe", "pipe", "pipe"] : ["ignore", "pipe", "pipe"],
  }).trim();
}

function api(path, method = "GET", body = null) {
  const args = ["api", path, "--method", method];
  if (body) args.push("--input", "-");
  const output = runGh(args, body ? JSON.stringify(body) : undefined);
  return output ? JSON.parse(output) : {};
}

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    if (ignored.has(entry.name)) return [];
    const fullPath = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}

const owner = runGh(["api", "user", "--jq", ".login"]);
const fullName = `${owner}/${repo}`;
const ref = api(`/repos/${fullName}/git/ref/heads/${branch}`);
const parentSha = ref.object.sha;
const parentCommit = api(`/repos/${fullName}/git/commits/${parentSha}`);

const tree = listFiles(".").map((file) => {
  const content = readFileSync(file).toString("base64");
  const blob = api(`/repos/${fullName}/git/blobs`, "POST", {
    content,
    encoding: "base64",
  });
  return {
    path: relative(".", file).split(sep).join("/"),
    mode: "100644",
    type: "blob",
    sha: blob.sha,
  };
});

const newTree = api(`/repos/${fullName}/git/trees`, "POST", {
  base_tree: parentCommit.tree.sha,
  tree,
});

const commit = api(`/repos/${fullName}/git/commits`, "POST", {
  message: "Subir codigo fuente de la app",
  tree: newTree.sha,
  parents: [parentSha],
});

api(`/repos/${fullName}/git/refs/heads/${branch}`, "PATCH", {
  sha: commit.sha,
});

console.log(`Codigo fuente publicado en https://github.com/${fullName}`);
