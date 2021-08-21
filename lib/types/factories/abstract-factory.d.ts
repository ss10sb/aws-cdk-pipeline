import { NonConstruct } from "@smorken/cdk-utils";
import { Naming } from "../naming";
import { Construct } from "@aws-cdk/core";
export declare abstract class AbstractFactory extends NonConstruct {
    protected readonly naming: Naming;
    protected constructor(scope: Construct, id: string);
}
