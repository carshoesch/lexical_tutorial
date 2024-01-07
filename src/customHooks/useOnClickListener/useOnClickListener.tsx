import {useCallback, useEffect, useState} from "react";
import formatService from '../../utils/formatService'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
    CAN_REDO_COMMAND,
    CAN_UNDO_COMMAND,
    REDO_COMMAND,
    UNDO_COMMAND,
    SELECTION_CHANGE_COMMAND,
    FORMAT_TEXT_COMMAND,
    FORMAT_ELEMENT_COMMAND,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    $getNodeByKey,
} from "lexical";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
    INSERT_ORDERED_LIST_COMMAND,
    INSERT_UNORDERED_LIST_COMMAND,
    REMOVE_LIST_COMMAND,
    $isListNode,
    ListNode,
} from "@lexical/list";
import {
    $isHeadingNode,
    $createHeadingNode,
    $createQuoteNode,
} from "@lexical/rich-text";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
    $createCodeNode,
    $isCodeNode,
    getDefaultCodeLanguage,
    getCodeLanguages,
} from "@lexical/code";
import {
    $isParentElementRTL,
    $wrapNodes,
    $isAtNodeEnd,
} from "@lexical/selection";
// @ts-ignore
import {eventTypes} from "../../components/toolbar/toolbarIconList";
/*import { InsertImageDialog } from "../CustomPlugins/ImagePlugin";
import useModal from "../../common/hooks/useModal";*/

const LowPriority = 1;

const UseOnClickListener = () => {
    const [editor] = useLexicalComposerContext()
    const [blockType, setBlockType] = useState('paragraph')
    const [selectedEventTypes, setSelectedEventTypes] = useState([])
    const [isLink, setIsLink] = useState(false)
    const [isRTL, setIsRTL] = useState(null)

    const updateToolbar = useCallback(() => {
        const selection = $getSelection();
        let allSelectedEvents = [...selectedEventTypes];

        // inner function

        const pushInEventTypesState = (selectionFormat, event) => {
            // creates a list  which contains the already pressed events(buttons)
            if (selectionFormat) {
                if (selectedEventTypes.includes(event)) return;
                else allSelectedEvents.push(event);
            } else {
                allSelectedEvents = allSelectedEvents.filter((ev) => ev !== event);
            }
        };

        // range selection ( e.g like to bold only the particular area of the text)
        if ($isRangeSelection(selection)) {
            const anchorNode = selection.anchor.getNode();
            const element =
                anchorNode.getKey() === "root"
                    ? anchorNode
                    : anchorNode.getTopLevelElementOrThrow();
            const elementKey = element.getKey();
            const elementDOM = editor.getElementByKey(elementKey);
            if (elementDOM !== null) {
                if ($isListNode(element)) {
                    const parentList = $getNearestNodeOfType(anchorNode, ListNode);
                    const type = parentList ? parentList.getTag() : element.getTag();
                    setBlockType(type);
                } else {
                    const type = $isHeadingNode(element)
                        ? element.getTag()
                        : element.getType();

                    setBlockType(type);
                }
            }

            pushInEventTypesState(selection.hasFormat("bold"), eventTypes.formatBold);
            pushInEventTypesState(
                selection.hasFormat("italic"),
                eventTypes.formatItalic
            );
            pushInEventTypesState(
                selection.hasFormat("underline"),
                eventTypes.formatUnderline
            );
            pushInEventTypesState(
                selection.hasFormat("strikethrough"),
                eventTypes.formatStrike
            );
            pushInEventTypesState(selection.hasFormat("code"), eventTypes.formatCode);

            setIsRTL($isParentElementRTL(selection));

            // Update links
            const node = getSelectedNode(selection);
            const parent = node.getParent();
            if ($isLinkNode(parent) || $isLinkNode(node)) {
                if (!allSelectedEvents.includes(eventTypes.formatInsertLink))
                    allSelectedEvents.push(eventTypes.formatInsertLink);
                setIsLink(true);
            } else {
                if (allSelectedEvents.includes(eventTypes.formatInsertLink)) {
                    allSelectedEvents = allSelectedEvents.filter(
                        (ev) => ev !== eventTypes.formatCode
                    );
                }
                setIsLink(false);
            }

            setSelectedEventTypes(allSelectedEvents);
        }
    }, [editor]);

    useEffect(() => {
        return mergeRegister(editor.registerUpdateListener(({editorState}) =>{
            editorState.read(() => {
                updateToolbar()
            })
        }),
        editor.registerCommand(SELECTION_CHANGE_COMMAND, () => {
            updateToolbar()
            return false
        }, LowPriority)
        )
    }, [editor, updateToolbar]);

    const onClick = (event: string) => {
        console.log('event', event)
        switch (event) {
            case eventTypes.h1:
                formatService.formath1(blockType, editor, $getSelection, $isRangeSelection, $wrapNodes, $createHeadingNode)
                break;

            case eventTypes.h2:
                // Handle event for h2
                formatService.formath1(blockType, editor, $getSelection, $isRangeSelection, $wrapNodes, $createHeadingNode)
                break;

            case eventTypes.ul:
                // Handle event for ul
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "someOtherFormat");
                break;

            case eventTypes.ol:
                // Handle event for ol
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "someOtherFormat");
                break;

            case eventTypes.paragraph:
                // Handle event for paragraphs
                formatService.formath1(blockType, editor, $getSelection, $isRangeSelection, $wrapNodes, $createParagraphNode)
                break;

            case eventTypes.quote:
                // Handle event for quote
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "someOtherFormat");
                break;

            case eventTypes.formatCode:
                // Handle event for formatCode
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "someOtherFormat");
                break;

            case eventTypes.formatUndo:
                // Handle event for formatUndo
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "someOtherFormat");
                break;

            case eventTypes.formatRedo:
                // Handle event for formatRedo
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "someOtherFormat");
                break;

            case eventTypes.formatBold:
                // Handle event for formatBold
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
                break;

            case eventTypes.formatItalic:
                // Handle event for formatItalic
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
                break;

            case eventTypes.formatUnderline:
                // Handle event for formatUnderline
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
                break;

            case eventTypes.formatStrike:
                // Handle event for formatStrike
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
                break;

            case eventTypes.formatInsertLink:
                // Handle event for formatInsertLink
                editor.dispatchCommand(FORMAT_TEXT_COMMAND, "");
                break;

            case eventTypes.formatAlignLeft:
                // Handle event for formatAlignLeft
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
                break;

            case eventTypes.formatAlignCenter:
                // Handle event for formatAlignCenter
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
                break;

            case eventTypes.formatAlignRight:
                // Handle event for formatAlignRight
                editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
                break;

            default:
                console.log('Unknown event: ', event);
        }

    }
    return {onClick}
};

const getSelectedNode = (selection) => {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
        return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
        return $isAtNodeEnd(focus) ? anchorNode : focusNode;
    } else {
        return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
    }
}

export default UseOnClickListener;