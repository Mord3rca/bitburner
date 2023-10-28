/*
	Standalone script used for money digging on remote servers
*/

/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];
    var sec_tresh = ns.args[1];
    var money_thres = ns.args[2];

    if (!(target || sec_tresh || money_thres)) {
        ns.tprint("Can't run, need args: [hostname, sec_tresh, money_thres]");
    }

    ns.tprint("Executing payload with following config");
    ns.tprint("    hostname: " + target);
    ns.tprint("    security: " + sec_tresh);
    ns.tprint("    money: " + money_thres);

    while(true) {
        if (ns.getServerSecurityLevel(target) > sec_tresh) {
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < money_thres) {
            await ns.grow(target);
        } else {
            await ns.hack(target);
        }
    }
}
