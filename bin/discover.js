/*
	Call on discover from libserver
	Used to refresh server cache
*/

import {discover} from "lib/server.js"

/** @param {NS} ns **/
export async function main(ns) {
	await discover(ns);
}
