export declare enum EntryPoint {
    PHP = 0,
    SH = 1,
    BASH = 2,
    UNDEFINED = 3
}
export declare enum Command {
    ARTISAN = 0,
    ON_CREATE = 1,
    MIGRATE = 2,
    MIGRATE_SEED = 3,
    MIGRATE_REFRESH = 4,
    SEED = 5,
    QUEUE_WORK = 6,
    QUEUE_ONE = 7,
    QUEUE_EXIT = 8,
    ROLE_SET = 9,
    SCHEDULE_ONE = 10,
    SCHEDULE_WORK = 11,
    UNDEFINED = 12
}
export interface ContainerCommand {
    readonly entryPoint?: string[];
    readonly command?: string[];
}
