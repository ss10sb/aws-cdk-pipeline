export interface SourceProps {
    owner: string;
    repo: string;
    branch?: string;
    triggerOnPush?: boolean;
}

export interface CodeStarSourceProps extends SourceProps {
    connectionArn: string;
}

