import {NonConstruct} from "@smorken/cdk-utils";
import {Construct} from "@aws-cdk/core";
import {CodeBuildStep, CodePipelineSource, IFileSetProducer} from "@aws-cdk/pipelines";
import {Role, ServicePrincipal} from "@aws-cdk/aws-iam";

export interface SynthStepProps {
    source: CodePipelineSource;
}

export class SynthStep extends NonConstruct {
    readonly synth: IFileSetProducer | CodeBuildStep;
    readonly props: SynthStepProps;
    readonly role: Role;

    constructor(scope: Construct, id: string, props: SynthStepProps) {
        super(scope, id);
        this.props = props;
        this.role = new Role(this.scope, this.mixNameWithId('synth-step-role'), {
            assumedBy: new ServicePrincipal('codebuild.amazonaws.com')
        });
        this.synth = this.createSynth();
    }

    protected createSynth(): IFileSetProducer | CodeBuildStep {
        return new CodeBuildStep(this.mixNameWithId('synth-step'), {
            input: this.props.source,
            commands: this.getCommands(),
            role: this.role
        });
    }

    protected getCommands(): string[] {
        return [
            this.getCopyCommand(),
            'npm ci',
            'npm run build',
            'npx cdk synth',
        ];
    }

    protected getCopyCommand(): string {
        const files: string[] = ['_common.js', 'defaults.js'];
        let parts: string[] = [];
        for (const file of files) {
            parts.push(`cp config/${file}.copy config/${file}`);
        }
        return parts.join(' && ');
    }
}
