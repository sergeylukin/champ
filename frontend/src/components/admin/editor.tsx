"use client";
import "@mdxeditor/editor/style.css";
import * as React from "react";
import { Button } from "@/components/ui/button";

import { MDXEditor } from "@mdxeditor/editor";
import { headingsPlugin } from "@mdxeditor/editor/plugins/headings";
import { listsPlugin } from "@mdxeditor/editor/plugins/lists";
import { quotePlugin } from "@mdxeditor/editor/plugins/quote";
import { thematicBreakPlugin } from "@mdxeditor/editor/plugins/thematic-break";
import { UndoRedo } from "@mdxeditor/editor/plugins/toolbar/components/UndoRedo";
import { BoldItalicUnderlineToggles } from "@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles";
import { BlockTypeSelect } from "@mdxeditor/editor/plugins/toolbar/components/BlockTypeSelect";
import { toolbarPlugin } from "@mdxeditor/editor/plugins/toolbar";

export function Editor({ onSave, initialContent = "" }) {
  const ref = React.useRef({ current: {} });
  React.useEffect(() => {
    ref?.current?.setMarkdown(initialContent);
  }, []);
  return (
    <div>
      <MDXEditor
        ref={ref}
        markdown="hello world"
        onChange={console.log}
        plugins={[
          toolbarPlugin({
            toolbarContents: () => (
              <>
                {" "}
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
              </>
            ),
          }),
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
        ]}
      />
      <Button
        className="bg-red-500 hover:bg-red-300"
        onClick={() => onSave(ref.current?.getMarkdown())}
      >
        Save
      </Button>
    </div>
  );
}
