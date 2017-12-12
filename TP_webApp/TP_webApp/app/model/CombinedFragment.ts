import { InteractionOperand } from "./InteractionOperand";

export class CombinedFragment{
        interactionOperator: string;
        interactionOperands: InteractionOperand[];

        constructor(operator: string, operands: InteractionOperand[]) {
            this.interactionOperands = operands;
            this.interactionOperator = operator;
        }
    }