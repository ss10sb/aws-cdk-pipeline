import {NonConstruct} from "@smorken/cdk-utils";
import {Naming} from "../naming";
import {Construct} from "@aws-cdk/core";

export abstract class AbstractFactory extends NonConstruct {
    protected readonly naming: Naming;

    protected constructor(scope: Construct, id: string) {
        super(scope, id);
        this.naming = new Naming();
    }
}
