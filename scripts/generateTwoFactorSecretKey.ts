import * as speakeasy from 'speakeasy';




function generateTwoFactorSecretKey(){
    const result = speakeasy.generateSecret({
        name: 'TSNodeMongo (root)',
    });

    console.dir(result, {depth: Infinity});
}

generateTwoFactorSecretKey();