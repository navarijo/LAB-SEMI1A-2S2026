import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
    UserPoolId: 'us-east-1_Z66ezSEDY', // Reemplazar con su User Pool ID
    ClientId: '3cigbhf8212eics3ugm79qqhhg' // Reemplazar con su Client ID
};

export default new CognitoUserPool(poolData);
