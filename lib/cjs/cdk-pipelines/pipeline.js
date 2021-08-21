"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipeline = void 0;
const pipelines_1 = require("@aws-cdk/pipelines");
const aws_codepipeline_1 = require("@aws-cdk/aws-codepipeline");
const cdk_utils_1 = require("@smorken/cdk-utils");
class Pipeline extends cdk_utils_1.NonConstruct {
    constructor(scope, id, props) {
        super(scope, id);
        this.props = props;
        this.cloudAssemblyArtifact = new aws_codepipeline_1.Artifact();
        this.synth = this.createSynthAction();
        this.pipeline = this.createPipeline();
    }
    fromEcrCodeBuild(ecrCodeBuild, stageName = 'EcrBuild') {
        return this.addStageAndActions(stageName, ecrCodeBuild.actions);
    }
    addStageAndActions(stageName, actions) {
        const stage = this.createStage(stageName);
        for (const action of actions) {
            stage.addAction(action);
        }
        return stage;
    }
    createStage(name) {
        return this.pipeline.codePipeline.addStage({ stageName: name });
    }
    createSynthAction() {
        const name = this.mixNameWithId('synth-build');
        let options = {
            projectName: name,
            actionName: name,
            sourceArtifact: this.props.source.sourceArtifact,
            cloudAssemblyArtifact: this.cloudAssemblyArtifact,
            subdirectory: this.props.synthSubdir,
            buildCommand: this.getBuildCommand()
        };
        return pipelines_1.SimpleSynthAction.standardNpmSynth(options);
    }
    createPipeline() {
        const name = this.mixNameWithId('pipeline');
        return new pipelines_1.CdkPipeline(this.scope, name, {
            pipelineName: name,
            cloudAssemblyArtifact: this.cloudAssemblyArtifact,
            sourceAction: this.props.source.sourceAction,
            synthAction: this.synth,
            dockerCredentials: [this.getDockerCredentialsFromRepositories()]
        });
    }
    getDockerCredentialsFromRepositories() {
        return pipelines_1.DockerCredential.ecr(this.props.repositories.repoArray());
    }
    getBuildCommand() {
        const files = ['_common.js', 'defaults.js'];
        let parts = [];
        for (const file of files) {
            parts.push(`cp config/${file}.copy config/${file}`);
        }
        return parts.join(' && ');
    }
}
exports.Pipeline = Pipeline;
//# sourceMappingURL=pipeline.js.map