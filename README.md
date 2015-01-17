# ntsc

Compile TypeScript without the hassle

ntsc compiles typescript source code without the need to supply references in all
of your files and without including the gigantic browser DOM libraries.

# how it works

When you pass the files to compile, `ntsc` finds their closest "references.d.ts"
file going up in the directory hierarchy. For example, if you write

    ntsc src/*.ts --outDir js

ntsc will look for src/references.d.ts, references.d.ts, ../references.d.ts and
so on until it finds one, and will transform the command into

    tsc --nolib references.d.ts src/*.ts --outDir js

which should hopefully result with fast compilation times

# license

ICS

