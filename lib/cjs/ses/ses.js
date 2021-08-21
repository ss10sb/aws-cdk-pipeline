"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ses = void 0;
const cdk_utils_1 = require("@smorken/cdk-utils");
const verify_ses_domain_1 = require("./verify-ses-domain");
class Ses extends cdk_utils_1.NonConstruct {
    verifyDomain(verifyDomain) {
        return new verify_ses_domain_1.VerifySesDomain(this.scope, this.mixNameWithId(`ses-verify-${verifyDomain.subdomain}`), {
            domainName: this.getDomainName(verifyDomain),
            hostedZoneName: verifyDomain.hostedZone,
            addMxRecord: false
        });
    }
    getDomainName(verifyDomain) {
        if (!verifyDomain.subdomain.endsWith(verifyDomain.hostedZone)) {
            return `${verifyDomain.subdomain}.${verifyDomain.hostedZone}`;
        }
        return verifyDomain.subdomain;
    }
}
exports.Ses = Ses;
//# sourceMappingURL=ses.js.map