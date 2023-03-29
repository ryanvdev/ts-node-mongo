import fs from 'node:fs';
import path from 'node:path';

const devDependencies:string[] = [
    '@types/node',
    '@total-typescript/ts-reset',
    '@types/express',
    '@types/ms',
    '@types/lodash',
    '@types/jsonwebtoken',
]

const dependencies:string[] = [
    'dotenv',
    'zod',
    'tsbytes',
    'express',
    'mongoose',
    'ms',
    'lodash',
    'jsonwebtoken'
]


const main = async () => {
    const commands:[string, string][] = [
        ['save-dev', `yarn add -D ^\n${devDependencies.join(' ^\n')}`],
        ['save', `yarn add ^\n${dependencies.join(' ^\n')}`],
    ];

    for(const [filename, command] of commands){
        fs.writeFileSync(
            path.join(__dirname, `./${filename}.bat`),
            command,
            {
                encoding: 'utf-8'
            }
        );
    }


    console.log('write file success');
}

main();