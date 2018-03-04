import { LayerElement } from "./LayerElement";
import { CombinedFragment } from "./CombinedFragment";
import { RefMessage } from "./Message";

export abstract class InteractionFragment extends LayerElement {

    protected __parent: InteractionFragment;
    protected _children: InteractionFragment[] = [];
    protected _messages: RefMessage[] = [];

    public get parent(): InteractionFragment {
        return this.__parent;
    }

    public set parent(parent: InteractionFragment) {
        this.__parent = parent;
    }

    public get children(): InteractionFragment[] {
        return this._children;
    }

    public set children(children: InteractionFragment[]) {
        this._children = children;
    }

    public get messages(): RefMessage[] {
        return this._messages;
    }

    public set messages(messages: RefMessage[]) {
        this._messages = messages;
    }

}