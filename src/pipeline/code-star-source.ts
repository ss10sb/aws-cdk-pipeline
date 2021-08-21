import {NonConstruct} from "@smorken/cdk-utils";
import {Construct} from "@aws-cdk/core";
import {CodeStarSourceProps} from "../definitions/source";
import {CodePipelineSource} from "@aws-cdk/pipelines";

export class PipelinesCodeStarSource extends NonConstruct {
    readonly props: CodeStarSourceProps;
    readonly source: CodePipelineSource;

    constructor(scope: Construct, id: string, props: CodeStarSourceProps) {
        super(scope, id);
        this.props = props;
        this.source = this.createCodeStarSource();
    }

    createCodeStarSource(): CodePipelineSource {
        return CodePipelineSource.connection(this.getRepo(), this.getBranch(), {
            connectionArn: this.props.connectionArn
        });
    }

    protected getBranch(): string {
        return this.props.branch ?? 'main';
    }

    protected getRepo(): string {
        return [...[this.props.owner], ...[this.props.repo]].join('/');
    }
}
