/*
	Standalone script used for money digging on remote servers
*/

/** @param {NS} ns **/
export async function main(ns) {
	var target = ns.args[0] || ns.getHostname();
	var sec_tresh = ns.getServerMinSecurityLevel(target) + 5;
	var money_thres = ns.getServerMaxMoney(target) * 0.80;

	while(true) {
		if (ns.getServerSecurityLevel(target) > sec_tresh) {
			await ns.weaken(target);
		} else if (ns.getServerMoneyAvailable(target) < money_thres) {
			await ns.grow(target);
		}
		else {
			await ns.hack(target);
		}
	}
}
