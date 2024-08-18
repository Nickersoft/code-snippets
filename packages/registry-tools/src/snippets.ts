import "core-js/features/object/group-by";

import { basename, extname } from "node:path";

import { extractTSDoc } from "@/extract-tsdoc.js";
import { extractDependencies } from "@/ast.js";
import type { ImportGlob, Snippet, SnippetMetadata } from "@/types.js";
import { transform } from "detype";

export function transformCode(code: string) {
  return code.replaceAll(/snippets\/(.+?)\/.+?\/(.+?)/g, "helpers/$2");
}

export async function createSnippets(
  files: ImportGlob,
): Promise<Record<string, Snippet[]>> {
  const snippets = await Promise.all(
    Object.entries(files).map(async ([path, content]) => {
      const [type, category, snippetName] = path.split("/").slice(-3);

      const code = ((await content()) as { default: string }).default;
      const baseURL = `/registry/${type}`;
      const name = basename(snippetName, extname(snippetName));
      const dependencies = await extractDependencies(code);

      return {
        type,
        category,
        dependencies,
        name,
        urls: {
          code: `${baseURL}/${name}.ts`,
          metadata: `${baseURL}/${name}.json`,
        },
        content: transformCode(code),
      };
    }),
  );

  return Object.groupBy(snippets, ({ type }) => type) as Record<
    string,
    Snippet[]
  >;
}

export async function getSnippetMetadata(snippet: Snippet) {
  const tsdoc = extractTSDoc(snippet);
  return { ...snippet, ...tsdoc } satisfies SnippetMetadata;
}
