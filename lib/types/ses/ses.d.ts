import { NonConstruct } from "@smorken/cdk-utils";
import { VerifySesDomain } from "./verify-ses-domain";
export interface SesVerifyDomainProps {
    subdomain: string;
    hostedZone: string;
}
export declare class Ses extends NonConstruct {
    verifyDomain(verifyDomain: SesVerifyDomainProps): VerifySesDomain;
    protected getDomainName(verifyDomain: SesVerifyDomainProps): string;
}
