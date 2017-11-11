import { OccurenceSpecification } from "./OccurenceSpecification";

export class Lifeline{
        name:string;
        type:string;
        occurenceSpecifications:OccurenceSpecification[];
    
        constructor(name:string,type:string,occurence:OccurenceSpecification[]){
            this.name = name;
            this.type = type;
            this.occurenceSpecifications = occurence;

        }

    }


    