import { PortMapping } from "@aws-cdk/aws-ecs";
import { Command, EntryPoint } from "./commands";
import { RepositoryType } from "../factories/repositories";
export declare enum ContainerType {
    UNDEFINED = "u",
    SERVICE = "s",
    RUN_ONCE_TASK = "rot",
    SCHEDULED_TASK = "st",
    CREATE_RUN_ONCE_TASK = "crot",
    UPDATE_RUN_ONCE_TASK = "urot"
}
export interface ContainerProps {
    readonly type?: ContainerType;
    readonly image: RepositoryType;
    readonly entryPoint?: EntryPoint;
    readonly command?: Command;
    readonly additionalCommand?: string[];
    readonly cpu: number;
    readonly memoryLimitMiB: number;
    readonly portMappings?: PortMapping[];
    readonly hasSecrets?: boolean;
    readonly hasEnv?: boolean;
    readonly essential?: boolean;
    readonly dependency?: boolean;
    readonly dependsOn?: boolean;
}
