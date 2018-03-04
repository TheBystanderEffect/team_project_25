import { InteractionFragment } from "./InteractionFragment";
import { CombinedFragment } from "./CombinedFragment";
import { OperandOccurenceSpecification } from "./OccurenceSpecification";

export class InteractionOperand extends InteractionFragment {

    protected __parent: CombinedFragment;
    protected _children: CombinedFragment[];

    protected _interactionConstraint: string;

    protected _startingOccurences: OperandOccurenceSpecification[];
    protected _endingOccurences: OperandOccurenceSpecification[];

    public get interactionConstraint(): string {
        return this._interactionConstraint;
    }

    public set interactionConstraint(interactionConstraint: string) {
        this._interactionConstraint = interactionConstraint;
    }

    public get parent(): CombinedFragment {
        return this.__parent;
    }

    public set parent(parent: CombinedFragment) {
        this.__parent = parent;
    }

    public get children(): CombinedFragment[] {
        return this._children;
    }

    public set children(children: CombinedFragment[]) {
        this._children = children;
    }

    public get startingOccurences(): OperandOccurenceSpecification[] {
        return this._startingOccurences;
    }

    public set startingOccurences(startingOccurences: OperandOccurenceSpecification[]) {
        this._startingOccurences = startingOccurences;
    }

    public get endingOccurences(): OperandOccurenceSpecification[] {
        return this._endingOccurences;
    }

    public set endingOccurences(endingOccurences: OperandOccurenceSpecification[]) {
        this._endingOccurences = endingOccurences;
    }
}