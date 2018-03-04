import { InteractionFragment } from "./InteractionFragment";
import { InteractionOperand } from "./InteractionOperand";
import { RefMessage } from "./Message";

export enum InteractionOperator {
    ALT = "ALT",
    OPT = "OPT",
    LOOP = "LOOP",
    PAR = "PAR"
}

export class CombinedFragment extends InteractionFragment {

    protected _interactionOperator: InteractionOperator;
    protected _children: InteractionOperand[];
    protected __parent: InteractionOperand;

    public get interactionOperator(): InteractionOperator {
        return this._interactionOperator;
    }

    public set interactionOperator(interactionOperator: InteractionOperator) {
        this._interactionOperator = interactionOperator;
    }

    public get parent(): InteractionOperand {
        return this.__parent;
    }

    public set parent(parent: InteractionOperand) {
        this.__parent = parent;
    }

    public get children(): InteractionOperand[] {
        return this._children;
    }

    public set children(children: InteractionOperand[]) {
        this._children = children;
    }

    public get messages(): RefMessage[] {
        return this.children.map(e => e.messages).reduce((a,v) => a.concat(v));
    }

    public set messages(messages: RefMessage[]) {
        throw new Error("LogicError: Setting messages on a combined fragment is not defined");
    }

}