import {NonConstruct} from "@smorken/cdk-utils";
import {VerifySesDomain} from "./verify-ses-domain";

export interface SesVerifyDomainProps {
    subdomain: string;
    hostedZone: string;
}

export class Ses extends NonConstruct {

    public verifyDomain(verifyDomain: SesVerifyDomainProps): VerifySesDomain {
        return new VerifySesDomain(this.scope, this.mixNameWithId(`ses-verify-${verifyDomain.subdomain}`), {
            domainName: this.getDomainName(verifyDomain),
            hostedZoneName: verifyDomain.hostedZone,
            addMxRecord: false
        });
    }

    protected getDomainName(verifyDomain: SesVerifyDomainProps): string {
        if (!verifyDomain.subdomain.endsWith(verifyDomain.hostedZone)) {
            return `${verifyDomain.subdomain}.${verifyDomain.hostedZone}`;
        }
        return verifyDomain.subdomain;
    }
}
