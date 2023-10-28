async function help(print) {
    print("Usage: stanek.js [cmd] <args>");
    print("Commands: ");
    print("    charge      - Charge all fragment");
    print("    grid        - Manage grid status");
}

async function charge(stanek, args) {
    for (const i of stanek.activeFragments()) {
        if (i.highestCharge >= i.numCharge)
            continue;
        await stanek.chargeFragment(i.x, i.y);
    };
}

async function gridHandler(stanek, args) {
    let cmd = args[1] || 'list';
}

/** @param {NS} ns **/
export async function main(ns) {
    let cmd = ns.args[0] || 'charge';

    const cmds = new Map();
        cmds.set("charge", charge);
        cmds.set("grid", gridHandler);

    if (! cmds.has(cmd)) {
        ns.tprint("Command not recognized");
        help(ns.tprint);
        return;
    }

    if (! ns.stanek.acceptGift()) {
        ns.tprint("Stanek Gift is not available, aborting..")
        return;
    }

    await cmds.get(cmd)(ns.stanek, ns.args);
}
