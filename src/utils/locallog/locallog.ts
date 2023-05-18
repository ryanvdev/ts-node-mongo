export function log(...messages: any[]) {
    console.group(new Date().toJSON());
    console.log(...messages);
    console.groupEnd();
    console.log();
}

export function object(subject: any, title?: any) {
    console.group(new Date().toJSON());
    if (title) {
        console.log(title);
    }
    console.dir(subject, { depth: Infinity });
    console.groupEnd();
    console.log();
}
