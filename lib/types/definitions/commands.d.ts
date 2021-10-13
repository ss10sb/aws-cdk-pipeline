export declare enum EntryPoint {
    PHP = 0,
    SH = 1,
    BASH = 2,
    UNDEFINED = 3
}
export declare enum Command {
    ARTISAN = 0,
    ON_CREATE = 1,
    ON_UPDATE = 2,
    MIGRATE = 3,
    MIGRATE_SEED = 4,
    MIGRATE_REFRESH = 5,
    SEED = 6,
    QUEUE_WORK = 7,
    QUEUE_ONE = 8,
    QUEUE_EXIT = 9,
    ROLE_SET = 10,
    SCHEDULE_ONE = 11,
    SCHEDULE_WORK = 12,
    UNDEFINED = 13
}
export interface ContainerCommand {
    readonly entryPoint?: string[];
    readonly command?: string[];
}
