export enum EntryPoint {
    PHP,
    SH,
    BASH,
    UNDEFINED
}

export enum Command {
    ARTISAN,
    ON_CREATE,
    ON_UPDATE,
    MIGRATE,
    MIGRATE_SEED,
    MIGRATE_REFRESH,
    SEED,
    QUEUE_WORK,
    QUEUE_ONE,
    QUEUE_EXIT,
    ROLE_SET,
    SCHEDULE_ONE,
    SCHEDULE_WORK,
    UNDEFINED
}

export interface ContainerCommand {
    readonly entryPoint?: string[];
    readonly command?: string[];
}
