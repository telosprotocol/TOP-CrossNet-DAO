import { Html, Head, Main, NextScript } from 'next/document'

import { readFileSync } from 'fs';
import { join } from 'path';


class InlineStylesHead extends Head {
  getCssLinks(files: any) {
    const { assetPrefix, dynamicImports } = this.context;
    const cssFiles = files.allFiles.filter((f: any) => f.endsWith('.css'));
    const sharedFiles = new Set(files.sharedFiles);

    // Unmanaged files are CSS files that will be handled directly by the
    // webpack runtime (`mini-css-extract-plugin`).
    let dynamicCssFiles = dedupe(dynamicImports.filter((f: any) => f.file.endsWith('.css'))).map(
      (f) => f.file,
    );
    if (dynamicCssFiles.length) {
      const existing = new Set(cssFiles);
      dynamicCssFiles = dynamicCssFiles.filter((f) => !(existing.has(f) || sharedFiles.has(f)));
      cssFiles.push(...dynamicCssFiles);
    }

    let cssLinkElements: any = [];
    cssFiles.forEach((file: any) => {
      if (!process.env.__NEXT_OPTIMIZE_CSS) {
        cssLinkElements.push(
          <style
            key={file}
            dangerouslySetInnerHTML={{
              __html: readFileSync(join(process.cwd(), '.next', file), 'utf-8'),
            }}
          />,
        );
      }

      cssLinkElements.push(
        <style
          key={file}
          dangerouslySetInnerHTML={{
            __html: readFileSync(join(process.cwd(), '.next', file), 'utf-8'),
          }}
        />,
      );
    });

    if (process.env.NODE_ENV !== 'development' && process.env.__NEXT_OPTIMIZE_FONTS) {
      cssLinkElements = this.makeStylesheetInert(cssLinkElements);
    }

    return cssLinkElements.length === 0 ? null : cssLinkElements;
  }
}

function dedupe(bundles: any) {
  const files = new Set();
  const kept = [];

  for (const bundle of bundles) {
    if (files.has(bundle.file)) continue;
    files.add(bundle.file);
    kept.push(bundle);
  }
  return kept;
}


export default function Document() {
  return (
    <Html lang="en">
      <InlineStylesHead>
        <meta name="theme-color" content="#ffcc66" />
      </InlineStylesHead>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
