import shell from 'shelljs';

// Exectue async shell commands
export async function execShellCommand(cmd: string): Promise<number> {
    return new Promise((resolve) => {
        shell.exec(cmd, (code, stdout, stderr) => {
            if (code !== 0) {
                shell.echo(stdout);
                shell.echo(stderr);
                shell.exit(code);
            }
            resolve(code);
        });
    });
}