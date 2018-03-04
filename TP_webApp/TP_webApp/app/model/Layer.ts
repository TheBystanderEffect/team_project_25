import { InteractionFragment } from "./InteractionFragment";
import { Lifeline } from "./Lifeline";
import { StoredMessage } from "./Message";
import { DiagramElement } from "./DiagramElement";
import { CombinedFragment } from "./CombinedFragment";

export class Layer extends DiagramElement {

    protected _lifelines: Lifeline[];
    protected _messages: StoredMessage[];
    protected _fragments: CombinedFragment[];

    public get lifelines(): Lifeline[] {
        return this._lifelines;
    }

    public set lifelines(lifelines: Lifeline[]) {
        this._lifelines = lifelines;
    }

    public get messages(): StoredMessage[] {
        return this._messages;
    }

    public set messages(messages: StoredMessage[]) {
        this._messages = messages;
    }

    public get fragments(): CombinedFragment[] {
        return this._fragments;
    }

    public set fragments(fragments: CombinedFragment[]) {
        this._fragments = fragments;
    }
}