const formatParagraph = (blockType, editor, $getSelection, $isRangeSelection, $wrapNodes, $createParagraphNode) => {
    if (blockType !== "paragraph") {
        editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                $wrapNodes(selection, () => $createParagraphNode());
            }
        });
    }
};
const formath1 = (blockType, editor, $getSelection, $isRangeSelection, $wrapNodes, $createHeadingNode) => {
    if (blockType !== "h1") {
        editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                $wrapNodes(selection, () => $createHeadingNode("h1"));
            }
        });
    }
};
const formath2 = (blockType, editor, $getSelection, $isRangeSelection, $wrapNodes, $createHeadingNode) => {
    if (blockType !== "h2") {
        editor.update(() => {
            const selection = $getSelection();

            if ($isRangeSelection(selection)) {
                $wrapNodes(selection, () => $createHeadingNode("h2"));
            }
        });
    }
};

const formatService= {
    formatParagraph,
    formath1,
    formath2
}

export default formatService