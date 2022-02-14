"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodePipelinePipeline = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const pipelines_1 = require("@aws-cdk/pipelines");
const aws_codebuild_1 = require("@aws-cdk/aws-codebuild");
class CodePipelinePipeline extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.pipeline = this.createCodePipeline();
    }
    createCodePipeline() {
        const name = this.mixNameWithId('code-pipeline');
        return new pipelines_1.CodePipeline(this.scope, name, {
            pipelineName: name,
            synth: this.props.synth.synth,
            dockerCredentials: [pipelines_1.DockerCredential.ecr(this.getRepositoryArray())],
            crossAccountKeys: true,
            assetPublishingCodeBuildDefaults: {
                buildEnvironment: {
                    buildImage: aws_codebuild_1.LinuxBuildImage.STANDARD_5_0,
                    privileged: true,
                    environmentVariables: {}
                }
            }
        });
    }
    getRepositoryArray() {
        let repos = [];
        for (const [key, repo] of this.props.repositories.repoEntries()) {
            repos.push(repo);
        }
        return repos;
    }
}
exports.CodePipelinePipeline = CodePipelinePipeline;
//# sourceMappingURL=code-pipeline-pipeline.js.map