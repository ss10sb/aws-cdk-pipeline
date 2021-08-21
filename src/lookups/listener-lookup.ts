import {Construct} from "@aws-cdk/core";
import {Config} from "@smorken/cdk-utils";
import {ApplicationListener, ApplicationProtocol, IApplicationListener} from "@aws-cdk/aws-elasticloadbalancingv2";

export class ListenerLookup {

    public static getApplicationListener(scope: Construct, config: Config, albArn: string): IApplicationListener {
        const lookupOptions = {
            loadBalancerArn: albArn,
            listenerPort: 443,
            listenerProtocol: ApplicationProtocol.HTTPS
        }
        return ApplicationListener.fromLookup(scope, 'lookup-https-listener', lookupOptions);
    }
}
