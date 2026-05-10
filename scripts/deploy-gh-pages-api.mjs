import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const repo = "construye-palabras-con-adri";
const branch = "gh-pages";
const distDir = "dist";

function runGh(args, input) {
  return execFileSync("gh", args, {
    encoding: "utf8",
    input,
    stdio: input ? ["pipe", "pipe", "pipe"] : ["ignore", "pipe", "pipe"],
  }).trim();
}

function runGhJson(args, input) {
  const output = runGh(args, input);
  return output ? JSON.parse(output) : {};
}

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(fullPath) : [fullPath];
  });
}

function api(path, method = "GET", body = null) {
  const args = ["api", path, "--method", method];
  if (body) {
    args.push("--input", "-");
  }
  return runGhJson(args, body ? JSON.stringify(body) : undefined);
}

if (!existsSync(distDir) || !statSync(distDir).isDirectory()) {
  throw new Error("No existe dist/. Ejecuta npm run build antes de desplegar.");
}

const owner = runGh(["api", "user", "--jq", ".login"]);
const fullName = `${owner}/${repo}`;

try {
  runGh(["repo", "view", fullName, "--json", "name"]);
  console.log(`Repositorio existente: ${fullName}`);
} catch {
  runGh([
    "repo",
    "create",
    fullName,
    "--public",
    "--description",
    "App educativa infantil para aprender a leer en español con Adri.",
    "--disable-wiki",
  ]);
  console.log(`Repositorio creado: ${fullName}`);
}

try {
  api(`/repos/${fullName}/git/ref/heads/main`);
} catch {
  api(`/repos/${fullName}/contents/README.md`, "PUT", {
    message: "Crear repositorio",
    content: Buffer.from("# Construye palabras con Adri\n").toString("base64"),
    branch: "main",
  });
  console.log("Commit inicial creado en main.");
}

let parentSha = "";
let baseTree = "";

try {
  const ref = api(`/repos/${fullName}/git/ref/heads/${branch}`);
  parentSha = ref.object.sha;
  const parentCommit = api(`/repos/${fullName}/git/commits/${parentSha}`);
  baseTree = parentCommit.tree.sha;
} catch {
  console.log(`La rama ${branch} se creara desde cero.`);
}

const tree = listFiles(distDir).map((file) => {
  const content = readFileSync(file).toString("base64");
  const blob = api(`/repos/${fullName}/git/blobs`, "POST", {
    content,
    encoding: "base64",
  });
  return {
    path: relative(distDir, file).split(sep).join("/"),
    mode: "100644",
    type: "blob",
    sha: blob.sha,
  };
});

const treeBody = { tree };
if (baseTree) {
  treeBody.base_tree = baseTree;
}
const newTree = api(`/repos/${fullName}/git/trees`, "POST", treeBody);

const commitBody = {
  message: "Deploy Construye palabras con Adri",
  tree: newTree.sha,
};
if (parentSha) {
  commitBody.parents = [parentSha];
}
const commit = api(`/repos/${fullName}/git/commits`, "POST", commitBody);

if (parentSha) {
  api(`/repos/${fullName}/git/refs/heads/${branch}`, "PATCH", { sha: commit.sha });
} else {
  api(`/repos/${fullName}/git/refs`, "POST", { ref: `refs/heads/${branch}`, sha: commit.sha });
}

try {
  api(`/repos/${fullName}/pages`, "POST", {
    source: { branch: "gh-pages", path: "/" },
  });
} catch {
  api(`/repos/${fullName}/pages`, "PUT", {
    source: { branch: "gh-pages", path: "/" },
  });
}

console.log(`Pages configurado: https://${owner}.github.io/${repo}/`);
