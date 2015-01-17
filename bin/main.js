#!/usr/bin/env node

var path = require('path');
var fs   = require('fs');
var cp   = require('child_process');


function containsReferences(dir) {
    var tried = fs.existsSync(path.resolve(dir, 'references.d.ts'))
    return tried;
}

function findReferences(firstDir) {
    while (!containsReferences(firstDir)) {
        var prevDir = firstDir;
        firstDir = path.resolve(firstDir, '../');
        if (prevDir == firstDir) return null;
    }
    return firstDir;
}

//----------------------------------------------------
// create arguments
//----------------------------------------------------

function keyVal(args, key) {
    if (key === '$0' || key === '_') return [];
    var kname = (key.length > 1 ? '--' : '-') + key;
    if (typeof(args[key]) === 'boolean')
        return args[key] ? [kname] : [];
    return [kname, args[key].toString()]
}


//----------------------------------------------------
// run
//----------------------------------------------------


function main(args) {
    var first    = args._[0];
    var firstDir = path.dirname(first);
    var refDir   = findReferences(firstDir);

    if (!refDir) {
        console.error("Error: references.d.ts not found in ",
                      firstDir, "or any of its parents");
        return process.exit(1);
    }

    var tsBin  = path.resolve(__dirname, '../node_modules/typescript/bin/tsc');
    var tsArgs = Object.keys(args).reduce(function(res, key) {
        return res.concat(keyVal(args, key));
    }, [])
    tsArgs.push('--nolib');
    //tsArgs.push(path.resolve(__dirname, '../ecma.d.ts'));
    tsArgs.push(path.resolve(refDir, 'references.d.ts'));
    tsArgs = tsArgs.concat(args._);

    //console.log(tsBin, tsArgs.join(' '));
    var child = cp.spawn(tsBin, tsArgs)

    process.stdin.pipe(child.stdin);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
    child.on('exit', function(code) {
        process.exit(code);
    });
}

main(require('optimist').argv);

